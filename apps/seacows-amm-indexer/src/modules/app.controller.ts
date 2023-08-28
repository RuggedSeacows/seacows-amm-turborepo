import { ConfigService } from '@nestjs/config';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JsonRpcProvider } from '@ethersproject/providers';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from './prisma/prisma.service';
import { getRpcProvider } from 'src/utils/rpc';
import { AppConfig } from 'src/config/type';

@Controller()
export class AppController {
  private rpcProvider: JsonRpcProvider;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    this.rpcProvider = getRpcProvider(
      this.configService.get('RPC_URL', { infer: true }),
    );
  }

  @Get('health')
  async healthCheck() {
    return 'OK';
  }

  @Get('rpc')
  async getCurrentBlock() {
    try {
      return {
        success: true,
        message: 'RPC is OK',
        block: await this.rpcProvider.getBlockNumber(),
      };
    } catch (e) {
      return {
        success: false,
        message: (e as Error).message,
        block: null,
      };
    }
  }

  @Get('test')
  @UseGuards(AuthGuard('api-key'))
  async openTestingApiKey() {
    return {
      success: true,
    };
  }
}
