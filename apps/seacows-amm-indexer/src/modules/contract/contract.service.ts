import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { AppConfig } from '../../config/type';
import { PrismaService } from '../prisma/prisma.service';

type ReadPastBlockStatus = 'active' | 'completed' | 'none';

@Injectable()
export class ContractService {
  private readonly logger = new Logger('ContractService');
  private readonly redis: Redis;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    this.redis = this.redisService.getClient();
  }

  getActiveContracts() {
    return this.prismaService.contracts.findMany({
      where: {
        is_active: true,
      },
    });
  }

  getContractByAddress(address: string) {
    return this.prismaService.contracts.findFirst({
      where: {
        address: {
          equals: address,
          mode: 'insensitive',
        },
      },
    });
  }

  async updateReadPastBlockStatus(
    contractId: number,
    status: ReadPastBlockStatus = 'none',
  ) {
    const result = await this.redis.set(
      this.getReadPastBlockStatusKey(contractId),
      status,
    );

    if (result !== 'OK') {
      throw new Error('Error during set past blocks status: ' + contractId);
    }
  }

  async updateLastReadBlock(contractId: number, blockNumber: number) {
    const status = (await this.redis.get(
      this.getReadPastBlockStatusKey(contractId),
    )) as ReadPastBlockStatus;

    if (status === 'completed' || status === 'none') {
      await this.prismaService.contracts.update({
        where: {
          id: contractId,
        },
        data: {
          last_read_block: blockNumber,
        },
      });
    } else {
      this.logger.log('updateLastReadBlock skipped', {
        contractId,
        blockNumber,
      });
    }
  }

  private getReadPastBlockStatusKey(id: number) {
    return `ProcessEvents:${id}-past-blocks-status`;
  }
}
