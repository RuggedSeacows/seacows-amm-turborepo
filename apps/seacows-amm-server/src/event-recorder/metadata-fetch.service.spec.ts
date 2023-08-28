import { Test, TestingModule } from '@nestjs/testing';
import { Web3Module } from 'nest-web3';
import { MetadataFetchService } from './metadata-fetch.service';
import { HttpModule } from 'nestjs-http-promise';
describe('MetadataFetchService', () => {
  let service: MetadataFetchService;
  const ERC721Address = '0xa44d5f2954Eb528E9cDa391C63EFfe56B38D6556';
  const ERC20Address = '0xbF42fb20703d2B32d4580EFA4BB20F2D4FacbBca';
  const chainName = 'Goerli';
  const web3Module = Web3Module.forRoot({
    name: 'Goerli',
    url: 'https://eth-goerli.g.alchemy.com/v2/-bB-PmLODMFTOBn_29826EICqKjRqZYa',
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [web3Module, HttpModule],
      providers: [MetadataFetchService],
    }).compile();

    service = module.get<MetadataFetchService>(MetadataFetchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it(
    'should be get nft metadata',
    async () => {
      const result = await service.getERC721MetadataByTokenID(
        ERC721Address,
        '1',
        chainName
      );
      expect(result).toBeDefined();
    },
    30 * 1000
  );
  it(
    'should be get collection metadatas',
    async () => {
      const result = await service.getERC721MetadataByAddress(
        ERC721Address,
        chainName
      );
      expect(result.length).toBeGreaterThan(10);
    },
    30 * 1000
  );
  it('should be get collection name', async () => {
    const result = await service.getERC721NameByAddress(
      ERC721Address,
      chainName
    );
    expect(result).toBeDefined();
  });
  it('should be get erc20 name', async () => {
    const result = await service.getERC20InfoByAddress(ERC20Address, chainName);
    expect(result).toBeDefined();
  });
});
