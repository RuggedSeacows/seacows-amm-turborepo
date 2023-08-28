import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { collections } from '@prisma/client';
import { AppConfig } from '../../config/type';
import { PrismaService } from '../prisma/prisma.service';
import { getNftCollections } from 'src/web3/api/center';
import { CollectionMetadata } from 'src/utils/types';

@Injectable()
export class CollectionService {
  private readonly logger = new Logger('CollectionService');
  private readonly redis: Redis;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    this.redis = this.redisService.getClient();
  }

  fetchCollectionMetadata(address: string) {
    return getNftCollections(address);
  }

  getCollection(address: string) {
    return this.prismaService.collections.findUnique({
      where: {
        address,
      },
    });
  }

  getPoolCollections() {
    return this.prismaService.$queryRaw<
      Array<{ nft_address: string } & collections>
    >`
      SELECT DISTINCT("nft_address"), c.*
      FROM public.pools
      LEFT JOIN collections c ON c.address = pools.nft_address ;
    `;
  }

  saveCollection(metadata: CollectionMetadata) {
    const { address, name, symbol, numAssets, smallPreviewImageUrl } = metadata;
    return this.prismaService.collections.create({
      data: {
        address,
        name,
        symbol,
        num_assets: numAssets,
        image_url: smallPreviewImageUrl,
      },
    });
  }
}
