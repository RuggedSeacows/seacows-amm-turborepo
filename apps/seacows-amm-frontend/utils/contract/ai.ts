import Web3 from 'web3';
export const web3 = new Web3(); // window.web3.currentProvider
import { wallet } from '@utils/wallet';
import { networks } from '@lib/net';
import { TestSeacowsTokenAddress, SeacowsCollectionRegistryAddress } from '@lib/contract';
import SeacowsNFTworldsJSON from '@lib/merkle-tree/0xbd4455da5929d5639ee098abfaa3241e9ae111af.json';
import SeacowsOtherdeedNFTJSON from '@lib/merkle-tree/0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258.json';
import { SeacowsNFTworlds, SeacowsOtherdeedNFT } from '@lib/index';
import { getTempalte, getTemplateContracts } from '@utils/contract/index';
const NfttransMap: any = {
  [SeacowsNFTworlds as string]: SeacowsNFTworldsJSON,
  [SeacowsOtherdeedNFT as string]: SeacowsOtherdeedNFTJSON
};
const setChain = (chain: string) => {
  web3.setProvider(new Web3.providers.HttpProvider(networks[chain as any]));
};

export const getAssetPrice = (address: string, collection: string, tokenId: string, chain: string) => {
  setChain(chain);
  const contract = new web3.eth.Contract(
    require('../../lib/abi/TestSeacowsToken/index.json'),
    SeacowsCollectionRegistryAddress
  );
  const transactionParameters = {
    to: TestSeacowsTokenAddress,
    from: address,
    data: contract.methods.getAssetPrice(collection, tokenId).encodeABI(),
    gas: '200000',
    chainId: chain
  };
};

export const getGroupPrice = async (collection: string, chain: string) => {
  setChain(chain);
  const contract = new web3.eth.Contract(
    require('../../lib/abi/TestSeacowsToken/index.json'),
    SeacowsCollectionRegistryAddress
  );
  try {
    return await contract.methods.getGroupPrice(collection, 0).call();
  } catch (e) {
    return '1000000000000000000';
  }
};

export const getGroupId = (address: string, tokenId: string) => {
  return NfttransMap[address.toLowerCase()]?.tokens?.find((item: any, index: any) => item.tokenId === tokenId)?.group;
};

export const getDetails = (tokenAddress: string, tokenIds: Array<string>) => {
  const details: { groupId: string; merkleProof: any }[] = [];
  NfttransMap[tokenAddress.toLowerCase()]?.tokens?.forEach((item: any) => {
    if (tokenIds.some((_item: string) => _item === item.tokenId)) {
      details.push({
        groupId: item.group,
        merkleProof: item.proof
      });
    }
  });
  return details.map((item: any) => ({ groupId: item.groupId, merkleProof: item.merkleProof }));
};

export const getSellNFTQuote = async (numNFTs: number, pool: string, chain: string) => {
  setChain(chain);
  // const details: { groupId: string; merkleProof: any }[] = []
  // NfttransMap[tokenAddress.toLowerCase()]?.tokens?.forEach((item: any) => {
  //   if (nftIds.some((_item: string) => _item === item.tokenId)) {
  //     details.push({
  //       groupId: item.group,
  //       merkleProof: item.proof
  //     })
  //   }
  // });
  // console.log(contract, nftIds, details.map((item:any) => ({ groupId: item.groupId, merkleProof: item.merkleProof })), 'contract')
  const currentContract = new web3.eth.Contract(require('@lib/abi/SeacowsPair.sol/SeacowsPair.json'), pool);
  console.log(currentContract, pool, numNFTs);
  return await currentContract.methods.getSellNFTQuote(numNFTs).call();
};

export const getBuyNFTQuote = async (numNFTs: number, pool: string, chain: string) => {
  setChain(chain);
  // const details: { groupId: string; merkleProof: any }[] = []
  // NfttransMap[tokenAddress.toLowerCase()]?.tokens?.forEach((item: any) => {
  //   if (nftIds.some((_item: string) => _item === item.tokenId)) {
  //     details.push({
  //       groupId: item.group,
  //       merkleProof: item.proof
  //     })
  //   }
  // });
  const currentContract = new web3.eth.Contract(require('@lib/abi/SeacowsPair.sol/SeacowsPair.json'), pool);
  return await currentContract.methods.getBuyNFTQuote(numNFTs).call();
};
