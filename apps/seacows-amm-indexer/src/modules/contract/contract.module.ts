import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContractService } from './contract.service';

@Module({
  imports: [PrismaModule],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
