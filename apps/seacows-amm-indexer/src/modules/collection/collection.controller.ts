import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JsonRpcProvider } from '@ethersproject/providers';
import { AppConfig } from 'src/config/type';
import { CollectionService } from './collection.service';
import { PrismaService } from '../prisma/prisma.service';
import { BigNumber } from 'ethers';

@Controller('collections')
export class CollectionController {
  private rpcProvider: JsonRpcProvider;
  private readonly logger = new Logger('CollectionController');
  constructor(
    private readonly prismaService: PrismaService,
    private readonly collectionService: CollectionService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  @Get('/')
  async getPoolCollections() {
    try {
      const collections = await this.collectionService.getPoolCollections();

      return {
        success: true,
        data: collections,
      };
    } catch (e) {
      this.logger.error('getPoolCollections error', { e });

      return {
        success: true,
        data: [],
      };
    }
  }

  @Get('/:address')
  async getCollection(@Param('address') address: string) {
    try {
      let collection = await this.collectionService.getCollection(address);

      if (!collection) {
        const metadata = await this.collectionService.fetchCollectionMetadata(
          address,
        );
        collection = await this.collectionService.saveCollection(metadata);
      }

      return {
        success: true,
        data: collection,
      };
    } catch (e) {
      this.logger.error('getCollection error', { e });
    }

    return {
      success: false,
      data: null,
    };
  }
}
