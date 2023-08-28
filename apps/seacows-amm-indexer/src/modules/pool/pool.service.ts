import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogType, pools, pool_logs, Prisma } from '@prisma/client';
import { BigNumber } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { NewPairEventValue } from 'src/utils/types';
import { AppConfig } from '../../config/type';
import { getRpcProvider } from '../../utils/rpc';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePairPayload } from './pool.types';
import { checksumAddress } from 'src/utils/address';
import { QueryPoolDto } from './dto/query-pool.dto';

BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

@Injectable()
export class PoolService {
  private readonly logger = new Logger('PoolService');
  private readonly rpcProvider: JsonRpcProvider;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    this.rpcProvider = getRpcProvider(
      this.configService.get('RPC_URL', { infer: true }),
    );
  }

  getPools({
    token,
    nft_address,
    owner,
    skip,
    limit
  }: QueryPoolDto) {
    const numLimit = Number(limit);
    return this.prismaService.pools.findMany({
      where: {
        token: token
          ? token
          : {
              not: '',
            },
        nft_address: checksumAddress(nft_address),
        owner: checksumAddress(owner),
      },
      skip: Number(skip || 0),
      take: limit ? (numLimit > 50 ? 50 : numLimit) : 50, // default 50
    });
  }

  async getPoolSwaps(type: LogType) {
    if (!type) {
      return [];
    }
    
    return await this.prismaService.pool_logs.findMany({
      where: {
        type: type
      }
    });
  }

  async getPoolSwapsForAddress(address: string, type: LogType) {
    if (type === 'SELL') {
      return await this.prismaService.$queryRaw<pool_logs[]>(Prisma.raw(`
        SELECT
          "pool_logs".*
        FROM
          public.pool_logs
        JOIN public.pools ON
          "pools".address = "pool_logs".pool_address
        WHERE
          "pool_logs".data LIKE ('%\"tokenRecipient\":\"${address}\"%')
        AND
          "pool_logs"."type" = 'SELL'
        ;
      `))
    }

    if (type === 'BUY') {
      return await this.prismaService.$queryRaw<pool_logs[]>(Prisma.raw(`
        SELECT
          "pool_logs".*
        FROM
          public."pool_logs"
        JOIN public."pools" ON
          "pools"."address" = "pool_logs"."pool_address"
        WHERE
          "pool_logs"."data" LIKE ('%\"nftRecipient\":\"${address}\"%')
        AND
          "pool_logs"."type" = 'BUY'
        ;
      `))
    }
    
    return [];
  }

  async getPoolsWithVolumes() {
    const data = await this.prismaService.$queryRaw<
      Array<{ address: string; pool_volume: Prisma.Decimal; count: number }>
    >`
      SELECT pools."address", SUM("volume"::decimal) AS "pool_volume", count(*)
      FROM public.pools
      LEFT JOIN public.pool_logs pl ON pools."address" = pl."pool_address"
      WHERE pl."type" = 'BUY' OR pl."type" = 'SELL'
      GROUP BY pools."address" ORDER BY "pool_volume" DESC;
    `;

    return data.map((d) => ({
      address: d.address,
      volume: d.pool_volume ? d.pool_volume.toFixed() : null,
      count: d.count,
    }));
  }

  async getPoolsWith24HrVolumes() {
    const latestBlockNumber = await this.rpcProvider.getBlockNumber();
    const blockNumber24HrsAgo = latestBlockNumber - (3600 / 12) * 24 * 1; // 1 block = 12 secs
    const data = await this.prismaService.$queryRaw<
      Array<{ address: string; pool_volume: Prisma.Decimal; count: number }>
    >`
      SELECT pools."address", SUM("volume"::decimal) AS "pool_volume", count(*)
      FROM public.pools
      LEFT JOIN public.pool_logs pl ON pools."address" = pl."pool_address"
      WHERE (pl."type" = 'BUY' OR pl."type" = 'SELL')
      AND pl."block_number" >= ${blockNumber24HrsAgo}
      AND pl."block_number" <= ${latestBlockNumber}
      GROUP BY pools."address" ORDER BY "pool_volume" DESC;
    `;

    return data.map((d) => ({
      address: d.address,
      volume: d.pool_volume ? d.pool_volume.toFixed() : null,
      count: d.count,
    }));
  }

  async getPoolMap() {
    const pools = await this.prismaService.pools.findMany();
    const poolMap: Record<string, pools> = {};

    for (const pool of pools) {
      poolMap[pool.address] = pool;
    }

    return poolMap;
  }

  createPool(data: CreatePairPayload & NewPairEventValue) {
    const { address, contract, initial_nft_ids, ...rest } = data;
    return this.prismaService.pools.create({
      data: {
        address,
        initial_nft_ids: (initial_nft_ids || []).join(', '),
        ...rest,
        contract: {
          connect: {
            address: contract,
          },
        },
      },
    });
  }

  sortByVolume(pools: Array<{ volume?: string }>) {
    pools.sort((a, b) => {
      if (a.volume && b.volume) {
        const av = BigNumber.from(a.volume);
        const bv = BigNumber.from(b.volume);
        return av.gt(bv) ? -1 : av.eq(bv) ? 0 : 1;
      }

      return -1;
    });
  }
}
