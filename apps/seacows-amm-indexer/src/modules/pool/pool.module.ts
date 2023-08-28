import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PoolController } from './pool.controller';
import { PoolService } from './pool.service';

@Module({
  imports: [PrismaModule],
  providers: [PoolService],
  exports: [PoolService],
  controllers: [PoolController],
})
export class PoolModule {}
