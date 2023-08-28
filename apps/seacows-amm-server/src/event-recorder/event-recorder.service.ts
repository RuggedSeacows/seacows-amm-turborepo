/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';
import SeacowsPairFactoryABI from '@seacows/amm-abi/dist/abi/SeacowsPairFactory.sol/SeacowsPairFactory.json';
import { NewPairEventValue } from './interface';
import { Contract, PastEventOptions } from 'web3-eth-contract';
import { ethers } from 'ethers';
import { Web3Service } from 'nest-web3';
import * as _ from 'lodash';
export const NEW_PAIR_EVENT_NAME = 'NewPair';
export const ChainConfig = {
  Goerli: '0x4AA65D5886Cb59Df1616E86fEC1fFe01b7Ece5B7',
};
@Injectable()
export class EventRecorderService {
  chainName = 'Goerli';
  constructor(private readonly web3Service: Web3Service) {}
  getFactoryContract(chainName = 'Goerli'): Contract {
    const SeacowsPairFactoryAddress = ChainConfig[chainName];
    if (!SeacowsPairFactoryAddress) {
      throw new Error(`Invalid chain name ${chainName}`);
    }
    const web3 = this.web3Service.getClient(this.chainName);
    const factoryContract = new web3.eth.Contract(
      SeacowsPairFactoryABI.filter((abi) => abi.type !== 'receive') as any,
      SeacowsPairFactoryAddress
    );
    return factoryContract;
  }

  // 根据 Tx 信息获取 Event 信息
  async getTxValue(
    tx: string,
    chainName = 'Goerli'
  ): Promise<NewPairEventValue> {
    const web3 = this.web3Service.getClient(chainName);
    const response = await web3.eth.getTransaction(tx);
    const inter = new ethers.utils.Interface(SeacowsPairFactoryABI);
    const decoded = inter.parseTransaction({ data: response.input });
    const blockNumber = response.blockNumber;
    const owner = response.from.toUpperCase();
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
        nftAddress: nft as string,
        poolType: poolType as number,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        initialNFTIDs: initialNFTIDs.map((x) => x.toBigInt()),
        // @ts-ignore
        initialTokenBalance: initialTokenBalance.toBigInt(),
        // @ts-ignore
        spotPrice: spotPrice.toBigInt(),
        // @ts-ignore
        delta: delta.toBigInt(),
        // @ts-ignore
        fee: fee.toBigInt(),
        bondingCurve: bondingCurve as string,
        assetRecipient: assetRecipient as string,
        blockNumber,
        chainName,
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
        nftAddress: nft,
        poolType: poolType as number,
        // @ts-ignore
        initialNFTIDs: initialNFTIDs.map((x) => x.toBigInt()),
        // @ts-ignore
        initialTokenBalance: 0n,
        // @ts-ignore
        spotPrice: spotPrice.toBigInt(),
        // @ts-ignore
        delta: delta.toBigInt(),
        // @ts-ignore
        fee: fee.toBigInt(),
        bondingCurve: bondingCurve,
        assetRecipient: assetRecipient,
        blockNumber,
        chainName,
        owner,
      };
      return value;
    }
  }
  // 解析 Event 信息， 生成 Pool 和 Pair 信息
  async getPairInfoByEvent(
    event: any,
    chainName = 'Goerli'
  ): Promise<NewPairEventValue & { address: string }> {
    const factoryContract = this.getFactoryContract(chainName);
    const eventJsonInterface = _.find(
      //@ts-ignore
      factoryContract._jsonInterface,
      (o) => o.name === NEW_PAIR_EVENT_NAME && o.type === 'event'
    );
    const web3 = this.web3Service.getClient(chainName);
    try {
      const eventObj = web3.eth.abi.decodeLog(
        eventJsonInterface.inputs,
        event.raw.data,
        event.raw.topics.slice(1)
      );
      const value = await this.getTxValue(event.transactionHash);
      return {
        address: eventObj.poolAddress,
        ...value,
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async getHistoryPoolInfo(options: PastEventOptions, chainName = 'Goerli') {
    if (options.fromBlock == null) {
      options.fromBlock = 1;
    }
    const factoryContract = this.getFactoryContract(chainName);
    const rawEvents = await factoryContract.getPastEvents(
      NEW_PAIR_EVENT_NAME,
      options
    );
    const events = await Promise.all(
      rawEvents.map((rawEvent) => this.getPairInfoByEvent(rawEvent, chainName))
    );
    return events;
  }
}
