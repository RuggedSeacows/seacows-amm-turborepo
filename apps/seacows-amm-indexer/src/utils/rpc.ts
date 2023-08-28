import { ethers } from 'ethers';

export const getRpcProvider = (url: string) => {
  return new ethers.providers.StaticJsonRpcProvider(url);
};
