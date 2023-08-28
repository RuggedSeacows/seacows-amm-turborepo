import { Module } from '@nestjs/common';
import { AmmContractService } from './amm-contract.service';

@Module({
  providers: [AmmContractService],
  exports: [AmmContractService],
})
export class AmmContractModule {}
