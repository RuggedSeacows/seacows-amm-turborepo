import { Test, TestingModule } from '@nestjs/testing';
import { AmmPoolService } from './amm-pool.service';

describe('AmmPoolService', () => {
  let service: AmmPoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmmPoolService],
    }).compile();

    service = module.get<AmmPoolService>(AmmPoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
