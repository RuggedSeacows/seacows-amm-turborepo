/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, Logger } from '@nestjs/common';
import PromisePool from '@supercharge/promise-pool/dist';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { EventRecorderService } from './event-recorder.service';
import { NewPairEventValue } from './interface';
import { MetadataFetchService } from './metadata-fetch.service';
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};
@Injectable()
export class EventRecorderStorageService {
  logger = new Logger('EventRecorderStorageService');
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventRecorderService: EventRecorderService,
    private readonly metadataFetchService: MetadataFetchService
  ) {}
  // 同步所有的 NFT Pool 创建信息
  async syncPoolCreateEvent(chainName = 'Goerli') {
    const response =
      await this.prismaService.factoryPoolContractEvent.findFirst({
        where: {
          chainName: chainName,
        },
        orderBy: {
          blockNumber: 'desc',
        },
      });
    const lastBlockNumber = response?.blockNumber || 0;
    const events = await this.eventRecorderService.getHistoryPoolInfo({
      fromBlock: lastBlockNumber,
    });
    const { errors, results: updateCollectionResult } = await PromisePool.for(
      events
    )
      .withConcurrency(2)
      .process(async (event) => {
        try {
          return await this.syncEvent2ERC20AndERC721(event);
        } catch (err) {
          this.logger.error(err);
          throw err;
        }
      });
    this.logger.log(
      `updateCollectionResult ${JSON.stringify(updateCollectionResult)}`
    );
    if (errors.length > 0) {
      this.logger.error(`syncPoolCreateEvent error: ${JSON.stringify(errors)}`);
      throw new Error(`syncPoolCreateEvent error: ${JSON.stringify(errors)}`);
    }
    const result = await this.prismaService.factoryPoolContractEvent.createMany(
      {
        data: events,
        skipDuplicates: true,
      }
    );
    this.logger.log('syncPoolCreateEvent result', result);
    return result;
  }
  // 插入单条 pool 创建信息
  async insertSingleEvent(
    event: NewPairEventValue & {
      address: string;
    }
  ) {
    await this.syncEvent2ERC20AndERC721(event);
    const result = await this.prismaService.factoryPoolContractEvent.create({
      data: event,
    });
    this.logger.log('insertSingleEvent result', result);
    return result;
  }
  async syncEvent2ERC20AndERC721(event: NewPairEventValue) {
    let collection;
    let token;
    try {
      collection = await this.syncCollections(
        event.nftAddress,
        event.chainName
      );
    } catch (err) {
      this.logger.error(
        `Get collections address: ${event.nftAddress}, chain name: ${event.chainName}`
      );
      this.logger.error(err.stack);
      throw err;
    }
    try {
      token =
        event.token == 'ETH'
          ? {}
          : await this.syncERC20Info(event.token, event.chainName);
    } catch (err) {
      this.logger.error(
        `Get Token address: ${event.token}, chain name: ${event.chainName}`
      );
      console.trace(err);
      this.logger.error(err.stack);
      throw err;
    }
    return {
      collection,
      token,
    };
  }
  // 同步 Collection 对应的所有 Metadata
  async syncNFTMetadata(address: string, chainName: string) {
    const metadataResult =
      await this.metadataFetchService.getERC721MetadataByAddress(
        address,
        chainName
      );
    const result = metadataResult.map((result) => ({
      ...result,
      imageUrl: (result.metadata['image'] || '') as string,
      address: address,
      metadata: result.metadata as any,
    }));
    return await this.prismaService.erc721Token.createMany({
      data: result,
      skipDuplicates: true,
    });
  }
  async syncERC20Info(address: string, chainName: string) {
    if (address === 'ETH') {
      return {};
    }
    const erc20Info = await this.prismaService.erc20Token.findFirst({
      where: {
        address: address,
        chainName: chainName,
      },
    });
    if (erc20Info) {
      return erc20Info;
    }
    const info = await this.metadataFetchService.getERC20InfoByAddress(
      address,
      chainName
    );
    return await this.prismaService.erc20Token.upsert({
      where: {
        address,
      },
      create: {
        address: address,
        chainName: chainName,
        name: info.name,
        symbol: info.symbol,
      },
      update: {},
    });
  }
  // 更新 Collection 信息
  async syncCollections(address: string, chainName: string) {
    const collectionExist = await this.prismaService.collection.findFirst({
      where: {
        address: address,
      },
    });
    if (collectionExist) {
      return;
    }
    const { count: updateNumber } = await this.syncNFTMetadata(
      address,
      chainName
    );
    this.logger.log('syncNFTMetadata updateNumber', updateNumber);
    let imageUrl = '';
    if (updateNumber !== 0) {
      const { imageUrl: firstTokenImageUrl } =
        await this.prismaService.erc721Token.findFirst({
          where: {
            address: address,
          },
          select: {
            imageUrl: true,
          },
        });
      imageUrl = firstTokenImageUrl;
    }
    return await this.prismaService.collection.upsert({
      where: {
        chainName_address: {
          address: address,
          chainName: chainName,
        },
      },
      create: {
        address: address,
        chainName: chainName,
        // TODO: Add auto derivation
        tokenType: 'erc721',
        name: await this.metadataFetchService.getERC721NameByAddress(
          address,
          chainName
        ),
        imageUrl,
      },
      update: {},
    });
  }
}
