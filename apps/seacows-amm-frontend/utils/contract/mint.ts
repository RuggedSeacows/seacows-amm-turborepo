import Web3 from 'web3';
import BigNumber from 'bignumber.js';
export const web3 = new Web3(); // window.web3.currentProvider
import { sendTransaction } from '@utils/wallet';
import { networks } from '@lib/net';

export interface HistoryItem {
  chainId: string;
  address: string;
  name: string;
  time: number;
  amount: number | string;
}

const setChain = (chain: string) => {
  web3.setProvider(new Web3.providers.HttpProvider(networks[chain]));
};
export const mintToken = async (
  address: string,
  contract: string,
  to: string,
  chainId: string,
  amount: number | string,
  abi: any
) => {
  console.log(address, contract, to, amount);
  setChain(chainId);
  const currentContract = new web3.eth.Contract(abi, contract);
  // console.log(await currentContract.methods.mint(to, amount).estimateGas({from: address, gas: '20000', value: '0'}), await currentContract.methods.mint(to, amount).estimateGas())
  // return
  console.log();
  return await sendTransaction({
    chainId,
    to: contract,
    from: address,
    data: currentContract.methods.mint(to, amount).encodeABI(),
    gas: '20000',
    gasPrice: ~~((await currentContract.methods.mint(to, amount).estimateGas({ from: address })) / 2)
  });
};

export const addHistory = (item: HistoryItem) => {
  const key = 'mint' + item.chainId + item.address;
  const history = localStorage.getItem(key) || '[]';
  const array = [item, ...JSON.parse(history)];
  localStorage.setItem(key, JSON.stringify(array));
};

export const getMintHistory = (address: string, chian: string) => {
  const key = 'mint' + chian + address;
  const history = localStorage.getItem(key) || '[]';
  return JSON.parse(history);
};
