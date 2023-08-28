import { Injectable, Logger } from '@nestjs/common';
import ERC721ABI from './erc721.abi.json';
import ERC20ABI from './erc20.abi.json';
import { PromisePool } from '@supercharge/promise-pool';
import { Web3Service } from 'nest-web3';
import { HttpService } from 'nestjs-http-promise';
import { IERC721Token } from './interface';
export const tokenURIABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

@Injectable()
export class MetadataFetchService {
  logger = new Logger();
  constructor(
    private readonly web3Service: Web3Service,
    private readonly httpService: HttpService
  ) {}
  async getERC721MetadataByTokenID(
    address: string,
    tokenId: string,
    chainName = 'Goerli'
  ): Promise<IERC721Token> {
    const web3 = await this.web3Service.getClient(chainName);
    const contract = new web3.eth.Contract(ERC721ABI as any, address);
    const metadataUri = await contract.methods.tokenURI(tokenId).call();
    const metadataResponse = await this.httpService.get(metadataUri, {
      timeout: 30 * 1000,
    });
    const metadata = metadataResponse.data;
    return {
      tokenId,
      tokenUri: metadataUri,
      metadata,
      chainName,
    };
  }
  // Get all token and metadata by address
  async getERC721MetadataByAddress(
    address,
    chainName = 'Goerli'
  ): Promise<IERC721Token[]> {
    const web3 = await this.web3Service.getClient(chainName);
    const contract = new web3.eth.Contract(ERC721ABI as any, address);
    try {
      let totalSupply;
      try {
        totalSupply = await contract.methods.totalSupply().call();
      } catch (e) {
        totalSupply = 0;
      }
      if (totalSupply <= 0) {
        return [];
      }
      const tokenId = await contract.methods.tokenByIndex(1).call();
      const metadataUri = await contract.methods.tokenURI(tokenId).call();
      const metadataResponse = await this.httpService.get(metadataUri, {
        timeout: 30 * 1000,
      });
      const metadata = metadataResponse.data;
      this.logger.log(`Get ${chainName} ${address} token ${tokenId} metadata`);
      return [
        {
          tokenId,
          tokenUri: metadataUri,
          chainName,
          metadata,
        },
      ];
    } catch (error) {
      this.logger.error(
        `get ERC721 failed with ${address}, chain name ${chainName}`
      );
      this.logger.error(error.stack);
      throw error;
    }
  }
  async getERC721NameByAddress(address, chainName = 'Goerli'): Promise<string> {
    const web3 = await this.web3Service.getClient(chainName);
    const contract = new web3.eth.Contract(ERC721ABI as any, address);
    const name = await contract.methods.name().call();
    return name;
  }
  async getERC20InfoByAddress(
    address,
    chainName = 'Goerli'
  ): Promise<{
    name: string;
    symbol: string;
  }> {
    const web3 = await this.web3Service.getClient(chainName);
    const contract = new web3.eth.Contract(ERC20ABI as any, address);
    try {
      const name = await contract.methods.name().call();
      const symbol = await contract.methods.symbol().call();
      return {
        name,
        symbol,
      };
    } catch (e) {
      this.logger.verbose(e.stack);
      throw e;
    }
  }
}
