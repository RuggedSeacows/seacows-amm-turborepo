import { Provider } from '@ethersproject/providers';
import { Logger } from '@nestjs/common';
import * as SeacowsPairFactoryABI from '@seacows/amm-abi/dist/abi/SeacowsPairFactory.sol/SeacowsPairFactory.json';
import { contracts } from '@prisma/client';
import {
  BigNumber,
  constants,
  ContractInterface,
  ethers,
  Event,
  Signer,
} from 'ethers';
import { eventTopicIds } from '../../utils/event';
import { BaseContract } from './base';
import { ContractService } from 'src/modules/contract/contract.service';
import { PoolService } from 'src/modules/pool/pool.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/type';
import { NewPairEventValue } from 'src/utils/types';

export class PairFactoryContract extends BaseContract {
  supportedEvents: string[];
  logger = new Logger('PairFactoryContract');

  protected readonly poolService: PoolService;
  protected readonly contractService: ContractService;
  protected factoryAddress: string;
  protected contract: contracts;

  constructor(
    configService: ConfigService<AppConfig>,
    contractService: ContractService,
    poolService: PoolService,
    contract: contracts,
    provider?: Signer | Provider,
    abi: ContractInterface = SeacowsPairFactoryABI,
  ) {
    super(contract.address, abi, provider);

    this.supportedEvents = [eventTopicIds.SeacowsPairFactory.newPair];
    this.contract = contract;
    this.poolService = poolService;
    this.contractService = contractService;
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
  async getTransactionInfo(
    transactionHash: string,
  ): Promise<NewPairEventValue> {
    try {
      const response = await this.provider.getTransaction(transactionHash);
      const iface = new ethers.utils.Interface(SeacowsPairFactoryABI);
      const decoded = iface.parseTransaction({
        data: response.data,
        value: response.value,
      });
      const owner = response.from;
      if (decoded.name == 'createPairERC20') {
        const {
          assetRecipient,
          bondingCurve,
          delta,
          fee,
          initialNFTIDs,
          initialTokenBalance,
          nft,
          poolType,
          spotPrice,
          token = 'ETH',
        } = decoded.args.params;
        const value = {
          name: decoded.name,
          token: token as string,
          nft_address: nft as string,
          type: Number(poolType),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          initial_nft_ids: initialNFTIDs.map((x) => x.toString()),
          // @ts-ignore
          initial_token_balance: initialTokenBalance.toString(),
          // @ts-ignore
          spot_price: spotPrice.toString(),
          // @ts-ignore
          delta: delta.toString(),
          // @ts-ignore
          fee: fee.toString(),
          bonding_curve: bondingCurve as string,
          asset_recipient: assetRecipient as string,
          owner,
        };
        return value;
      } else if (decoded.name == 'createPairETH') {
        const {
          _assetRecipient: assetRecipient,
          _bondingCurve: bondingCurve,
          _delta: delta,
          _fee: fee,
          _initialNFTIDs: initialNFTIDs,
          _nft: nft,
          _poolType: poolType,
          _spotPrice: spotPrice,
        } = decoded.args;
        const value = {
          name: decoded.name,
          token: 'ETH',
          nft_address: nft,
          type: Number(poolType),
          // @ts-ignore
          initial_nft_ids: initialNFTIDs.map((x) => x.toString()),
          // @ts-ignore
          initial_token_balance: '0',
          // @ts-ignore
          spot_price: spotPrice.toString(),
          // @ts-ignore
          delta: delta.toString(),
          // @ts-ignore
          fee: fee.toString(),
          bonding_curve: bondingCurve,
          asset_recipient: assetRecipient,
          owner,
        };
        return value;
      }
    } catch (error) {
      console.error('PairFactory getTransaction error', { error });

      return {
        name: '',
        token: '',
        nft_address: constants.AddressZero,
        type: 0,
        initial_nft_ids: [],
        initial_token_balance: '0',
        spot_price: '0',
        delta: '',
        fee: '0',
        bonding_curve: constants.AddressZero,
        asset_recipient: constants.AddressZero,
        owner: constants.AddressZero,
      };
    }
  }

  protected async processNewPairEvents(events: Event[]) {
    this.logger.log('processNewPairEvents start', {
      contract: this.contractAddress,
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
        const txInfo = await this.getTransactionInfo(pair.transactionHash);
        await this.poolService.createPool({
          contract: this.contractAddress,
          block_number: pair.blockNumber,
          transaction_hash: pair.transactionHash,
          address: pair.address,
          ...txInfo,
        });
      } catch (error) {
        console.error({ error });
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
