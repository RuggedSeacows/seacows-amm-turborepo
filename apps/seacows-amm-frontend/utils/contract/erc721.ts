import Web3 from 'web3';
export const web3 = new Web3(); // window.web3.currentProvider
import { networks } from '@lib/net';
import Erc721Abi from '@lib/abi/erc721.json';
const setChain = (chain: string) => {
  web3.setProvider(new Web3.providers.HttpProvider(networks[chain as any]));
};

export const Erc721Client = async (collection: string, chain: string) => {
  setChain(chain);
  return new web3.eth.Contract(Erc721Abi as any, collection);
};
