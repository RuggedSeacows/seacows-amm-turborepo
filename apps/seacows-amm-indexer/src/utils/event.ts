import { ethers } from 'ethers';

export const eventTopicIds = {
  ERC721: {
    transfer: ethers.utils.id('Transfer(address,address,uint256)'),
  },
  SeacowsPairFactory: {
    newPair: ethers.utils.id('NewPair(address)'),
  },
  SeacowsPair: {
    swapNFTInPair: ethers.utils.id('SwapNFTInPair()'),
    swapNFTOutPair: ethers.utils.id('SwapNFTOutPair()'),
    tokenDeposit: ethers.utils.id('TokenDeposit(uint256)'),
    tokenWithdrawal: ethers.utils.id('TokenWithdrawal(uint256)'),
    nftWithdrawal: ethers.utils.id('NFTWithdrawal()'),
  },
};
