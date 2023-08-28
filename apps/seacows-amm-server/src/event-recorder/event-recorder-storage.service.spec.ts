import { Test, TestingModule } from '@nestjs/testing';
import { EventRecorderStorageService } from './event-recorder-storage.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { EventRecorderService } from './event-recorder.service';
import { MetadataFetchService } from './metadata-fetch.service';
import { Web3Module } from 'nest-web3';
import { HttpModule } from 'nestjs-http-promise';
describe('EventRecorderStorageService', () => {
  let service: EventRecorderStorageService;
  let module: TestingModule;
  const Address = '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b';
  const chainName = 'Goerli';
  const web3Module = Web3Module.forRoot({
    name: 'Goerli',
    url: 'https://eth-goerli.g.alchemy.com/v2/-bB-PmLODMFTOBn_29826EICqKjRqZYa',
  });
  beforeEach(async () => {
    const prismaTestCollection = {
      create: jest.fn(async (res) => {
        console.log('create', res);
        return res;
      }),
      upsert: jest.fn(async (res) => {
        console.log('upsert', res);
        return res;
      }),
      createMany: jest.fn(async (res) => {
        console.log('createMany', res?.data?.length);
        console.log('createMany', res?.data?.[0]);
        return { count: 0 };
      }),
      findFirst: jest.fn(async (res) => {
        console.log('findFirst', res);
        return null;
      }),
      findMany: jest.fn(),
    };
    module = await Test.createTestingModule({
      imports: [web3Module, HttpModule],
      providers: [
        EventRecorderStorageService,
        {
          provide: PrismaService,
          useValue: {
            collection: prismaTestCollection,
            factoryPoolContractEvent: prismaTestCollection,
            erc721Token: prismaTestCollection,
            erc20Token: prismaTestCollection,
          },
        },
        EventRecorderService,
        MetadataFetchService,
      ],
    }).compile();

    service = module.get<EventRecorderStorageService>(
      EventRecorderStorageService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it(
    'should be get collection information',
    async () => {
      const result = await service.syncCollections(Address, chainName);
      expect(result).toBeDefined();
    },
    30 * 1000
  );
  it(
    'should be sync pool event',
    async () => {
      const syncCollectionsSpy1 = await jest
        .spyOn(service, 'syncEvent2ERC20AndERC721')
        .mockImplementation(async () => {
          return {
            collection: {
              id: 1,
              name: 'test',
              address: '0x123',
              chainName: 'Goerli',
              imageUrl: 'https://test.com',
              owner: '0x123',
              tokenType: 'ERC721',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            token: {
              id: 1,
              name: 'test',
              address: '0x123',
              chainName: 'Goerli',
              symbol: 'test',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          };
        });
      const result = await service.syncPoolCreateEvent(chainName);
      expect(syncCollectionsSpy1).toHaveBeenCalled();
      expect(result).toBeDefined();
    },
    30 * 1000
  );
  it(
    'should sync data',
    async () => {
      const event = {
        address: '0xA700564c9200E8917F89C8e23157E55810ae6feE',
        name: 'createPairERC20',
        token: '0xbF42fb20703d2B32d4580EFA4BB20F2D4FacbBca',
        nftAddress: Address,
        poolType: 2,
        initialNFTIDs: [37, 36, 42, 43],
        initialTokenBalance: 3841200000000000000,
        spotPrice: 1000000000000000000,
        delta: 20000000000000000,
        fee: 500000000000000000,
        bondingCurve: '0xedE840313c2733Aa1d9733317198D838eb78346c',
        assetRecipient: '0x0000000000000000000000000000000000000000',
        blockNumber: 7728369,
        chainName: 'Goerli',
        owner: '0x97B7D3ebb1B3B0075EaDB5cD6B48c265AdE333E3',
      };
      const result = await service.syncEvent2ERC20AndERC721(event as any);
      console.log(result);
      expect(result).toBeDefined();
    },
    60 * 1000
  );
});
