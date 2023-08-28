import Web3 from 'web3';
export const web3 = new Web3();
import { networks } from '@lib/net';
declare const window: any;
interface Params {
  to: string;
  from: string;
  data: any;
  chainId: string;
  value?: string;
  gas?: string;
  gasPrice?: number;
}

const walletMap: any = () => ({
  MetaMask: window.ethereum
});
export const wallet = () => {
  const walletType: any = localStorage.getItem('wallet');
  return walletMap()[walletType];
};

export const sendTransaction = async (params: Params) => {
  const { to, from, data, chainId, value, gasPrice } = params;
  const _wallet = wallet();
  // const gasPrice = await web3.eth.getGasPrice()
  const _gas = await web3.eth.estimateGas({
    to,
    data
  });
  console.log(gasPrice, 200000);
  try {
    const txHash = await _wallet.request({
      method: 'eth_sendTransaction',
      params: [
        {
          to,
          from,
          data,
          gas: String(gasPrice),
          chainId: chainId,
          value
        }
      ]
    });
    return txHash;
  } catch (error) {
    return false;
  }
};

const setChain = (chain: string) => {
  web3.setProvider(new Web3.providers.HttpProvider(networks[chain as any]));
};

export interface Transaction {
  tx: string;
  name: string;
  status: string | boolean;
  address: string;
  chain: string;
}

export const addHistory = (transaction: Transaction) => {
  const key = 'txhistory' + transaction.chain + transaction.address;
  const history = localStorage.getItem(key) || '[]';
  const array = [transaction, ...JSON.parse(history)];
  if (array.length > 20) array.length = 19;
  localStorage.setItem(key, JSON.stringify(array));
};

export const listenHistoryStatus = async (address: string, chain: string) => {
  setChain(chain);
  const key = 'txhistory' + chain + address;
  const history = localStorage.getItem(key) || '[]';
  const array = JSON.parse(history);
  for (let i = 0; i < array.length; i++) {
    const item: Transaction = array[i];
    if (typeof item.status == 'boolean') break;
    const recept = await web3.eth.getTransactionReceipt(item.tx);
    if (recept) {
      item.status = recept.status;
    }
  }
  localStorage.setItem(key, JSON.stringify(array));
};

export const getHistory = async (address: string, chain: string) => {
  const key = 'txhistory' + chain + address;
  await listenHistoryStatus(address, chain);
  const history = localStorage.getItem(key) || '[]';
  return JSON.parse(history);
};

export const clearHistory = (address: string, chain: string) => {
  const key = 'txhistory' + chain + address;
  localStorage.setItem(key, JSON.stringify([]));
};
