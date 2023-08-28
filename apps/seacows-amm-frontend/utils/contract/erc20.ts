import Web3 from 'web3';
export const web3 = new Web3(); // window.web3.currentProvider
import { networks } from '@lib/net';
import Erc20Abi from '@lib/abi/ERC20.sol/ERC20.json';
const setChain = (chain: string) => {
  web3.setProvider(new Web3.providers.HttpProvider(networks[chain as any]));
};

export const Erc20Client = async (token: string, chain: string) => {
  setChain(chain);
  return new web3.eth.Contract(Erc20Abi as any, token);
};
