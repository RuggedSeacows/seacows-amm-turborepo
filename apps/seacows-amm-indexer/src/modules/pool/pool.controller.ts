import { ConfigService } from '@nestjs/config';
import { Controller, Get, Logger, Param, Query, UseGuards } from '@nestjs/common';
import { JsonRpcProvider } from '@ethersproject/providers';
import { AppConfig } from 'src/config/type';
import { PoolService } from './pool.service';
import { PrismaService } from '../prisma/prisma.service';
import { QueryPoolDto } from './dto/query-pool.dto';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

@Controller('pools')
export class PoolController {
  private rpcProvider: JsonRpcProvider;
  private readonly logger = new Logger('PoolController');
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poolService: PoolService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  @Get('/')
  async getAllPools(@Query() input: QueryPoolDto) {
    try {
      const pools = await this.poolService.getPools(input);

      return {
        success: true,
        data: pools,
      };
    } catch (e) {
      this.logger.error('getAllPools error', { e });
    }

    return {
      success: false,
      data: [],
    };
  }

  @Get('/stats')
  async getPoolStats() {
    try {
      const buys = await this.poolService.getPoolSwaps('BUY');

      let totalBuy = BigNumber.from(0);
      for (const buy of buys) {
        totalBuy = totalBuy.add(BigNumber.from(buy.volume || 0));
      }

      const sells = await this.poolService.getPoolSwaps('SELL');

      let totalSell = BigNumber.from(0);
      for (const sell of sells) {
        totalSell = totalSell.add(BigNumber.from(sell.volume || 0));
      }

      return {
        success: true,
        data: [
          {
            name: 'buy',
            count: buys.length,
            total: parseFloat(formatEther(totalBuy).toString()).toFixed(4),
          },
          {
            name: 'sell',
            count: sells.length,
            total: parseFloat(formatEther(totalSell).toString()).toFixed(4),
          }
        ],
      };
    } catch (e) {
      this.logger.error('getAllPools error', { e });
    }

    return {
      success: false,
      data: [],
    };
  }

  @Get('/stats/:address')
  async getPoolStatsByAddress(@Param('address') address: string) {
    try {
      const buys = await this.poolService.getPoolSwapsForAddress(address, 'BUY');

      let totalBuy = BigNumber.from(0);
      for (const buy of buys) {
        totalBuy = totalBuy.add(BigNumber.from(buy.volume || 0));
      }

      const sells = await this.poolService.getPoolSwapsForAddress(address, 'SELL');

      let totalSell = BigNumber.from(0);
      for (const sell of sells) {
        totalSell = totalSell.add(BigNumber.from(sell.volume || 0));
      }

      return {
        success: true,
        data: {
          address,
          buy: {
            count: buys.length,
            total: totalBuy.toString()
          },
          sell: {
            count: sells.length,
            total: totalSell.toString()
          },
        },
      };
    } catch (e) {
      this.logger.error('getAllPools error', { e });
    }

    return {
      success: false,
      data: [],
    };
  }


  @Get('/volumes')
  async getAllPoolsWithVolumes() {
    try {
      const pools = await this.poolService.getPoolsWithVolumes();
      this.poolService.sortByVolume(pools);

      return {
        success: true,
        data: pools,
      };
    } catch (e) {
      console.error('volume error', e);
      this.logger.error('getAllPoolsWithVolumes error', { e });
    }

    return {
      success: false,
      data: [],
    };
  }

  @Get('/24hr-volumes')
  async getAllPoolsWith24HrVolumes() {
    try {
      const pools = await this.poolService.getPoolsWith24HrVolumes();
      this.poolService.sortByVolume(pools);

      return {
        success: true,
        data: pools,
      };
    } catch (e) {
      console.error('volume error', e);
      this.logger.error('getAllPoolsWith24HrVolumes error', { e });
    }

    return {
      success: false,
      data: [],
    };
  }
}
