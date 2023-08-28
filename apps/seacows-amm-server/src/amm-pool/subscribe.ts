import SeacowsPairFactoryABI from '@seacows/amm-abi/dist/abi/SeacowsPairFactory.sol/SeacowsPairFactory.json';
import SeacowsPairABI from '@seacows/amm-abi/dist/abi/SeacowsPair.sol/SeacowsPair.json';
import SeacowsPairERC20ABI from '@seacows/amm-abi/dist/abi/SeacowsPairERC20.sol/SeacowsPairERC20.json';

import _ from 'lodash';
import Web3 from 'web3';
import { ethers } from 'ethers';
import e from 'express';
const endpoint =
  'wss://rinkeby.infura.io/ws/v3/9a3f14b3724843eba39371fa3886319b';
const web3 = new Web3(endpoint);
const factoryAddress = '0x08B58B8f7fCa3Ad50a7E3AA557205b4b326A100e';
const poolAddress = '0x3c7a8a82253D8DBE5500C8fDCBb5cFFfED005AE5';
const createERC20Tx =
  '0xe6298507d5e1e7bcc117898551695f57c0b62aaa8b53e9ee4358e011b971953a';
// const pool = new Contract(
//   address,
//   SeacowsPairFactoryABI.filter((abi) => abi.type !== 'receive')
// );
const factoryContract = new web3.eth.Contract(
  SeacowsPairFactoryABI.filter((abi) => abi.type !== 'receive') as any,
  factoryAddress
);
const subscribedEvents = {};
// Subscriber method
const subscribeLogEvent = async (contract, eventName, callback) => {
  const eventJsonInterface = _.find(
    contract._jsonInterface,
    (o) => o.name === eventName && o.type === 'event'
  );
  const options = {
    address: factoryAddress,
    topics: [eventJsonInterface.signature],
  };
  const subscription = web3.eth.subscribe('logs', options, (error, result) => {
    if (!error) {
      const eventObj = web3.eth.abi.decodeLog(
        eventJsonInterface.inputs,
        result.data,
        result.topics.slice(1)
      );
      console.log(`New ${eventName}!`, eventObj);
    }
  });
  subscribedEvents[eventName] = subscription;
};
const getHistoryPoolInfo = async (contract) => {
  const rawEvents = await contract.getPastEvents('NewPair', { fromBlock: 1 });
  const eventJsonInterface = _.find(
    contract._jsonInterface,
    (o) => o.name === 'NewPair' && o.type === 'event'
  );
  const events = await Promise.all(
    rawEvents.map(async (event) => {
      try {
        const eventObj = web3.eth.abi.decodeLog(
          eventJsonInterface.inputs,
          event.raw.data,
          event.raw.topics.slice(1)
        );
        return {
          address: eventObj.poolAddress,
          ...(await getTxValue(event.transactionHash)),
        };
      } catch (err) {
        console.log(err);
        return null;
      }
    })
  );
  return events;
};
// 根据给定的 Tx 获取交易的 Env
const getTxValue = async (tx: string) => {
  const response = await web3.eth.getTransaction(tx);
  const inter = new ethers.utils.Interface(SeacowsPairFactoryABI);
  const decoded = inter.parseTransaction({ data: response.input });
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
      token: token,
      nft: nft,
      poolType: poolType as number,
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
      bondingCurve: bondingCurve,
      assetRecipient: assetRecipient,
    };
    return {
      value: value,
      name: decoded.name,
    };
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
      token: 'ETH',
      nft: nft,
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
    };
    return {
      value: value,
      name: decoded.name,
    };
  }
};
(async () => {
  return await getHistoryPoolInfo(factoryContract);
})().then(console.log);
