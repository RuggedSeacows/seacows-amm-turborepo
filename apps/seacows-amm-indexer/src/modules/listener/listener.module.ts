import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EventModule } from '../event/event.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ListenerService } from './listener.service';
import { ListenerProcessor } from './listener.processor';
import { ContractModule } from '../contract/contract.module';
import { PoolModule } from '../pool/pool.module';

@Module({
  imports: [
    PrismaModule,
    EventModule,
    ContractModule,
    PoolModule,
    BullModule.registerQueue({
      name: 'blocks',
      redis: process.env.REDIS_URL,
    }),
  ],
  providers: [ListenerService, ListenerProcessor],
})
export class ListenerModule {}
