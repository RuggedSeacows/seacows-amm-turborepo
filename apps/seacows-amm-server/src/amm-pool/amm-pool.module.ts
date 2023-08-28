import { Module } from '@nestjs/common';
import { AmmPoolService } from './amm-pool.service';
import { AmmPoolResolver } from './amm-pool.resolver';
import { AmmContractModule } from 'src/amm-contract/amm-contract.module';
@Module({
  imports: [AmmContractModule],
  providers: [AmmPoolService, AmmPoolResolver],
})
export class AmmPoolModule {}
