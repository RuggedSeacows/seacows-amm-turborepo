import * as SeacowsPairABI from '@seacows/amm-abi/dist/abi/SeacowsPair.sol/SeacowsPair.json';
import * as SeacowsPairEnumerableETHAbi from '@seacows/amm-abi/dist/abi/SeacowsPairEnumerableETH.sol/SeacowsPairEnumerableETH.json';
import { Provider } from '@ethersproject/providers';
import { Logger } from '@nestjs/common';
import * as SeacowsRouterABI from '../../abis/SeacowsRouter.json';
import { contracts, pools, LogType } from '@prisma/client';
import { BigNumber, ContractInterface, ethers, Event, Signer } from 'ethers';
import { eventTopicIds } from '../../utils/event';
import { BaseContract } from './base';
import { ContractService } from 'src/modules/contract/contract.service';
import { PoolService } from 'src/modules/pool/pool.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/type';
import { SwapResponse } from 'src/utils/types';

export class PairContract extends BaseContract {
  supportedEvents: string[];
  logger = new Logger('PairContract');

  protected readonly poolService: PoolService;
  protected readonly contractService: ContractService;
  protected pool: pools;

  constructor(
    configService: ConfigService<AppConfig>,
    contractService: ContractService,
    poolService: PoolService,
    pool: pools,
    provider?: Signer | Provider,
    abi: ContractInterface = SeacowsRouterABI,
  ) {
    super(pool.address, abi, provider);

    // TODO: Remove NewPair event filtering. It doesn't make sense for Pair contract
    this.supportedEvents = [eventTopicIds.SeacowsPairFactory.newPair];
    this.poolService = poolService;
    this.contractService = contractService;
    this.pool = pool;
  }

  async processEvents(topicId: string, events: Event[] = []): Promise<void> {
    if (topicId === eventTopicIds.SeacowsPairFactory.newPair) {
      return await this.processNewPairEvents(events);
    } else {
      throw new Error('Not supported or implemented yet');
    }
  }

  async filterEvent(
    topicId: string,
    fromBlock: number,
    toBlock: number,
  ): Promise<Event[]> {
    if (topicId === eventTopicIds.SeacowsPairFactory.newPair) {
      return await this.filterNewPairEvent(fromBlock, toBlock);
    } else {
      throw new Error('Not supported or implemented yet');
    }
  }

  protected async filterNewPairEvent(fromBlock: number, toBlock: number) {
    try {
      const events = await this.queryFilter(
        {
          topics: [eventTopicIds.SeacowsPairFactory.newPair],
        },
        fromBlock,
        toBlock,
      );

      return events;
    } catch (error) {
      this.logger.error('filterNewPairEvent', {
        fromBlock,
        toBlock,
        error,
      });
    }
  }

  getSwapTransactionInfo(topicId: string, transactionHash: string) {
    if (topicId === eventTopicIds.SeacowsPair.swapNFTInPair) {
      return this.getSellTransactionInfo(transactionHash);
    } else if (topicId === eventTopicIds.SeacowsPair.swapNFTOutPair) {
      return this.getBuyTransactionInfo(transactionHash);
    } else if (topicId === eventTopicIds.SeacowsPair.nftWithdrawal) {
      return this.getNFTWithdrawTransactionInfo(transactionHash);
    } else if (topicId === eventTopicIds.SeacowsPair.tokenWithdrawal) {
      return this.getTokenWithdrawTransactionInfo(transactionHash);
    } else {
      throw new Error('Unrecognized topic id: ' + topicId);
    }
  }

  async getSellTransactionInfo(transactionHash: string): Promise<SwapResponse> {
    const response = await this.provider.getTransaction(transactionHash);

    if (!response) {
      console.error('Cant find buy transaction: ' + transactionHash);
    }

    const iface = new ethers.utils.Interface(SeacowsRouterABI);
    const decoded = iface.parseTransaction({
      data: response.data,
      value: response.value,
    });
    const owner = response.from;

    if (decoded.name == 'swapNFTsForToken') {
      // const fResult = iface.decodeFunctionResult(decoded.functionFragment, response.data);

      // console.log('decoded: expect outputAmount in returnValues', fResult);

      const { swapList, minOutput, tokenRecipient } = decoded.args;

      const value = {
        type: 'swapNFTsForToken',
        ethAmount: decoded.value.toString(),
        owner,
        swapList,
        minOutput: minOutput.toString(),
        tokenRecipient,
      };

      // TODO: Replace `minOutput` with `outputAmount` from returnValues
      return {
        value,
        type: LogType.SELL,
        volume: value.minOutput,
      };
    } else {
      throw new Error('Unrecognized function signature: ' + decoded.name);
    }
  }

  async getNFTWithdrawTransactionInfo(
    transactionHash: string,
  ): Promise<SwapResponse> {
    const response = await this.provider.getTransaction(transactionHash);

    if (!response) {
      console.error('Cant find buy transaction: ' + transactionHash);
    }

    const iface = new ethers.utils.Interface(SeacowsPairABI);
    const decoded = iface.parseTransaction({
      data: response.data,
      value: response.value,
    });
    const owner = response.from;

    if (decoded.name == 'withdrawERC721') {
      const { a, nftIds } = decoded.args;

      return {
        value: {
          amount: nftIds.map((id) => id.toString()).join(', '),
          owner,
          token: a,
        },
        type: LogType.WITHDRAW_NFT,
        volume: '',
      };
    } else {
      throw new Error('Unrecognized function signature: ' + decoded.name);
    }
  }

  async getTokenWithdrawTransactionInfo(
    transactionHash: string,
  ): Promise<SwapResponse> {
    const response = await this.provider.getTransaction(transactionHash);

    if (!response) {
      console.error('Cant find buy transaction: ' + transactionHash);
    }

    const iface = new ethers.utils.Interface(SeacowsPairEnumerableETHAbi);
    const decoded = iface.parseTransaction({
      data: response.data,
      value: response.value,
    });
    const owner = response.from;

    if (decoded.name == 'withdrawETH') {
      const { amount } = decoded.args;

      return {
        value: {
          amount: amount.toString(),
          owner,
          token: 'ETH',
        },
        type: LogType.WITHDRAW_TOKEN,
        volume: '',
      };
    } else if (decoded.name == 'withdrawERC20') {
      const { amount, a } = decoded.args;

      return {
        value: {
          amount: amount.toString(),
          owner,
          token: a,
        },
        type: LogType.WITHDRAW_TOKEN,
        volume: '',
      };
    } else {
      throw new Error('Unrecognized function signature: ' + decoded.name);
    }
  }

  async getBuyTransactionInfo(transactionHash: string): Promise<SwapResponse> {
    const response = await this.provider.getTransaction(transactionHash);
    if (!response) {
      console.error('Cant find sell transaction: ' + transactionHash);
    }

    const iface = new ethers.utils.Interface(SeacowsRouterABI);
    const decoded = iface.parseTransaction({
      data: response.data,
      value: response.value,
    });
    const owner = response.from;
    if (decoded.name == 'swapETHForAnyNFTs') {
      // console.log('decoded: expect inputAmount in returnValues', decoded);

      const { swapList, ethRecipient, nftRecipient } = decoded.args;

      const value = {
        type: 'swapETHForAnyNFTs',
        ethAmount: decoded.value.toString(),
        owner,
        ethRecipient,
        swapList,
        nftRecipient,
      };

      return {
        value,
        type: LogType.BUY,
        volume: value.ethAmount,
      };
    } else if (decoded.name == 'swapETHForSpecificNFTs') {
      // console.log('decoded: expect inputAmount in returnValues', decoded);

      const { swapList, ethRecipient, nftRecipient } = decoded.args;

      const value = {
        type: 'swapETHForSpecificNFTs',
        ethAmount: decoded.value.toString(),
        owner,
        ethRecipient,
        swapList,
        nftRecipient,
      };

      return {
        value,
        type: LogType.BUY,
        volume: value.ethAmount,
      };
    } else if (decoded.name == 'swapERC20ForSpecificNFTs') {
      const { swapList, inputAmount, nftRecipient } = decoded.args;

      const value = {
        type: 'swapERC20ForSpecificNFTs',
        ethAmount: decoded.value.toString(),
        owner,
        swapList,
        inputAmount: inputAmount.toString(),
        nftRecipient,
      };

      return {
        value,
        type: LogType.BUY,
        volume: value.inputAmount,
      };
    } else {
      throw new Error('Unrecognized function signature: ' + decoded.name);
    }
  }

  protected async processNewPairEvents(events: Event[]) {
    this.logger.log('processNewPairEvents start', {
      contract: this.contract.address,
      eventCount: events.length,
    });

    const pairs = events
      .filter((event) => !event.removed)
      .map((event) => ({
        address: event.args[0],
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      }));

    let failed = 0;
    for await (const pair of pairs) {
      try {
        // const txInfo = await this.getTransactionInfo(pair.transactionHash);
      } catch (error) {
        this.logger.error('updateNewPairDetails failed', { pair, error });
        failed++;
      }
    }

    this.logger.log('processNewPairEvents done', {
      contract: this.contractAddress,
      eventCount: events.length,
      failedCount: failed,
    });
  }
}
