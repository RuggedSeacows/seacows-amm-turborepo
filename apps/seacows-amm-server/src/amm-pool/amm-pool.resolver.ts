import { Resolver, Mutation, Query, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AmmPoolService } from './amm-pool.service';
import { AmmPoolWhereInput, AmmPool, AmmPoolCreateInput } from './amm-pool.dto';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
const pubSub = new PubSub();

@Resolver(() => AmmPool)
export class AmmPoolResolver {
  constructor(private readonly ammPoolService: AmmPoolService) {}

  @Subscription(() => AmmPool)
  poolStatusUpdate() {
    return pubSub.asyncIterator('poolStateUpdate');
  }

  @Mutation(() => AmmPool)
  async createPool(@Args('data') data: AmmPoolCreateInput): Promise<AmmPool> {
    const response = await this.ammPoolService.createPool(data);
    const { txHash } = data;
    await this.ammPoolService.queryPoolStateSubscribe(response, pubSub);
    return response;
  }

  @Query(() => [AmmPool])
  async queryPools(
    @Args() { take, skip }: PaginationArgs,
    @Args('where') where: AmmPoolWhereInput
  ): Promise<AmmPool[]> {
    return await this.ammPoolService.queryPools(where, skip, take);
  }

  @Query(() => AmmPool)
  async queryPoolById(@Args('id') id: string): Promise<AmmPool> {
    return await this.ammPoolService.queryPoolById(id);
  }
}
