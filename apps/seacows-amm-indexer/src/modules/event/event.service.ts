import { Injectable, Logger } from '@nestjs/common';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AppConfig } from '../../config/type';
import { getRpcProvider } from '../../utils/rpc';

@Injectable()
export class EventService {
  private readonly logger = new Logger('EventService');
  private readonly rpcProvider: JsonRpcProvider;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    this.rpcProvider = getRpcProvider(
      this.configService.get('RPC_URL', { infer: true }),
    );
  }
}
