import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AmmPoolWhereInput, AmmPoolCreateInput, AmmPool } from './amm-pool.dto';
import { PoolState, Prisma } from 'prisma/generated/prisma-client';
import { AmmContractService } from 'src/amm-contract/amm-contract.service';
import { PubSub } from 'graphql-subscriptions';
@Injectable()
export class AmmPoolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ammContractService: AmmContractService
  ) {}
  async createPool(createInput: AmmPoolCreateInput): Promise<AmmPool> {
    return await this.prisma.ammPool.create({
      data: createInput,
    });
  }
  async queryPools(
    where: AmmPoolWhereInput,
    skip: number,
    take: number
  ): Promise<AmmPool[]> {
    return await this.prisma.ammPool.findMany({
      where,
      skip,
      take,
    });
  }
  async queryPoolById(id: string): Promise<AmmPool> {
    return await this.prisma.ammPool.findUnique({
      where: {
        id,
      },
    });
  }
  async updatePoolState(
    id: string,
    data: Prisma.AmmPoolUpdateInput
  ): Promise<AmmPool> {
    return await this.prisma.ammPool.update({
      where: {
        id,
      },
      data,
    });
  }
  async queryPoolStateSubscribe(ammPool: AmmPool, pubsub: PubSub) {
    return await this.ammContractService.subscriptionForAddress(
      ammPool.txHash,
      async (error: Error, log) => {
        const state = error ? PoolState.Rejected : PoolState.Approved;
        const poolAddress: string = log[0].address || '';
        pubsub.publish('poolStateUpdate', {
          pool: await this.updatePoolState(ammPool.id, {
            state,
            poolAddress,
          }),
        });
      }
    );
  }
}
