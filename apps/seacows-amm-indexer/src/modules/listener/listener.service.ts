import { SwapList } from './../../utils/types';
import { InjectQueue } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Queue } from 'bull';
import { AppConfig } from '../../config/type';
import { getRpcProvider } from '../../utils/rpc';
import { ContractService } from '../contract/contract.service';
import { BaseContract } from 'src/web3/contracts/base';
import { PairFactoryContract } from 'src/web3/contracts/pairFactory';
import { PoolService } from '../pool/pool.service';
import { eventTopicIds } from 'src/utils/event';
import { PrismaService } from '../prisma/prisma.service';
import { PairContract } from 'src/web3/contracts/pair';
import { pools } from '@prisma/client';
import { SwapResponse } from 'src/utils/types';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

@Injectable()
export class ListenerService implements OnApplicationShutdown {
  private readonly logger = new Logger('ListenerService');
  private readonly rpcProvider: JsonRpcProvider;
  private readonly FILTER_BLOCK_STEP: number;

  constructor(
    @InjectQueue('blocks') private readonly blocksQueue: Queue,
    private readonly poolService: PoolService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<AppConfig>,
    private readonly contractService: ContractService,
  ) {
    this.rpcProvider = getRpcProvider(
      this.configService.get('RPC_URL', { infer: true }),
    );

    this.FILTER_BLOCK_STEP = this.configService.get('FILTER_BLOCK_STEP', {
      infer: true,
    });
  }

  async parseMissingBlocks() {
    const contracts = await this.contractService.getActiveContracts();
    const latestBlockNumber = await this.rpcProvider.getBlockNumber();

    for await (const contract of contracts) {
      if (
        !contract.last_read_block ||
        contract.last_read_block < latestBlockNumber
      ) {
        const fromBlock = contract.last_read_block
          ? contract.last_read_block
          : contract.genesis_block;
        const toBlock = latestBlockNumber;

        this.logger.log('Dispatch jobs to read missing blocks in range', {
          fromBlock,
          toBlock,
          contract: contract.address,
        });

        await this.blocksQueue.add('init', {
          contractId: contract.id,
          from: fromBlock,
          to: toBlock,
          jobCount: Math.ceil((toBlock - fromBlock) / this.FILTER_BLOCK_STEP),
        });

        for (
          let block = toBlock + 1;
          block >= fromBlock;
          block -= this.FILTER_BLOCK_STEP
        ) {
          let startBlock = block - this.FILTER_BLOCK_STEP;
          if (startBlock < fromBlock) startBlock = fromBlock;

          await this.blocksQueue.add('read', {
            contract,
            from: startBlock,
            to: block - 1,
          });
        }
      } else {
        await this.contractService.updateReadPastBlockStatus(
          contract.id,
          'none',
        );
      }
    }
  }

  async listenToNewBlocks() {
    const contracts = await this.contractService.getActiveContracts();

    this.rpcProvider.on('block', async (blockNumber) => {
      this.logger.log('On block: ' + blockNumber);
      const poolMap = await this.poolService.getPoolMap();

      // PairFactory events
      for (const contract of contracts) {
        let contractInstance: BaseContract = null;

        if (contract.type === 'SeacowsPairFactory') {
          contractInstance = new PairFactoryContract(
            this.configService,
            this.contractService,
            this.poolService,
            contract,
            this.rpcProvider,
          );
        } else {
          this.logger.warn('Unidentified contract type: ' + contract.type, {
            contract,
          });
        }

        // Filter NewPair events on the current block
        contractInstance.filterEvents(blockNumber, blockNumber).then(() => {
          console.log(
            `filterEvents on Block ${blockNumber}, ${contract.address} done`,
          );

          this.contractService.updateLastReadBlock(contract.id, blockNumber);
        });
      }

      // Parse Pair events on the new block
      this.parsePoolLogs(
        eventTopicIds.SeacowsPair.swapNFTInPair,
        blockNumber,
        poolMap,
      );
      this.parsePoolLogs(
        eventTopicIds.SeacowsPair.swapNFTOutPair,
        blockNumber,
        poolMap,
      );
      this.parsePoolLogs(
        eventTopicIds.SeacowsPair.nftWithdrawal,
        blockNumber,
        poolMap,
      );
      this.parsePoolLogs(
        eventTopicIds.SeacowsPair.tokenWithdrawal,
        blockNumber,
        poolMap,
      );
    });
  }

  async parsePoolLogsInRange(
    topicId: string,
    fromBlock: number,
    toBlock: number,
    poolMap: Record<string, pools>,
  ) {
    const filter = {
      topics: [topicId],
      fromBlock,
      toBlock,
    };

    const logs = await this.rpcProvider.getLogs(filter);

    const swapInfos: Array<SwapResponse> = [];
    for (const log of logs) {
      const {
        removed,
        address,
        transactionHash,
        logIndex,
        transactionIndex,
        blockNumber,
      } = log;
      const pool = poolMap[address];

      if (removed || !pool) {
        continue;
      }

      try {
        const contract = new PairContract(
          this.configService,
          this.contractService,
          this.poolService,
          pool,
          this.rpcProvider,
        );

        // There can be 2 or more swap logs for each transaction
        const txInfo = await contract.getSwapTransactionInfo(
          topicId,
          transactionHash,
        );

        // Determine volume for this specific pool
        let volume = txInfo.volume || undefined;
        if (txInfo.type === 'SELL' || txInfo.type === 'BUY') {
          const swapList = (txInfo.value as any)?.swapList as SwapList;
          if (swapList?.length > 1) {
            const pair = swapList.find((sw) => sw.pair === address);

            if (!pair) {
              console.error('Pair not found', { txInfo, address });
            } else {
              let totalIds = 0;
              for (const sw of swapList) {
                totalIds += sw.nftIds.length;
              }

              volume = BigNumber.from(volume)
                .mul(pair.nftIds.length)
                .div(totalIds)
                .toString();
            }
          }
        }

        swapInfos.push(txInfo);

        await this.prismaService.pool_logs.create({
          data: {
            transaction_hash: transactionHash,
            log_index: logIndex,
            pool_address: pool.address,
            transaction_index: transactionIndex,
            block_number: blockNumber,
            topic_id: topicId,
            data: JSON.stringify(txInfo.value),
            type: txInfo.type,
            volume,
            amount: (txInfo.value as any).amount,
            token: (txInfo.value as any).token,
          },
        });
      } catch (error) {
        console.error('Save pool log error', { error, transactionHash });
      }
    }

    return swapInfos;
  }

  async parsePoolLogs(
    topicId: string,
    startBlock: number,
    poolMap: Record<string, pools>,
  ) {
    let endBlock = await this.rpcProvider.getBlockNumber();

    const swapInfos: Array<SwapResponse> = [];
    for (
      let block = startBlock;
      block <= endBlock;
      block += this.FILTER_BLOCK_STEP
    ) {
      let toBlock = block + this.FILTER_BLOCK_STEP;
      if (toBlock > endBlock) toBlock = endBlock;

      try {
        const results = await this.parsePoolLogsInRange(
          topicId,
          block,
          toBlock,
          poolMap,
        );
        swapInfos.push(...results);
      } catch (error) {
        console.error('parsePoolLogsInRange in range failed', {
          block,
          toBlock,
          topicId,
          error,
        });
      }
    }

    return swapInfos;
  }

  async parsePastLogs() {
    const poolMap = await this.poolService.getPoolMap();
    const startBlock = 7725617;

    const sellInfos = await this.parsePoolLogs(
      eventTopicIds.SeacowsPair.swapNFTInPair,
      startBlock,
      poolMap,
    );
    const buyInfos = await this.parsePoolLogs(
      eventTopicIds.SeacowsPair.swapNFTOutPair,
      startBlock,
      poolMap,
    );

    await this.parsePoolLogs(
      eventTopicIds.SeacowsPair.nftWithdrawal,
      startBlock,
      poolMap,
    );

    await this.parsePoolLogs(
      eventTopicIds.SeacowsPair.tokenWithdrawal,
      startBlock,
      poolMap,
    );

    let sum = BigNumber.from(0);
    for (const info of buyInfos) {
      sum = sum.add(BigNumber.from(info.volume));
    }
    console.log(
      'totalBuy',
      buyInfos.length,
      sum.toString(),
      formatEther(sum.toString()),
    );

    sum = BigNumber.from(0);
    for (const info of sellInfos) {
      sum = sum.add(BigNumber.from(info.volume));
    }
    console.log(
      'totalSell',
      sellInfos.length,
      sum.toString(),
      formatEther(sum.toString()),
    );
  }

  onApplicationShutdown(signal?: string) {
    this.logger.log('Before app shutdown, removing attached listeners...', {
      signal,
    });

    this.removeListeners();

    this.logger.log('Remove listeners done.');
  }

  private removeListeners() {
    this.rpcProvider.removeListener('block', (...args) => {
      this.logger.log('remove onBlock listener', { args });
    });
  }
}
