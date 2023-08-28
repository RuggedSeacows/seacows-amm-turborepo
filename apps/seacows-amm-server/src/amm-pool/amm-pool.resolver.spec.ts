import { Test, TestingModule } from '@nestjs/testing';
import { AmmPoolResolver } from './amm-pool.resolver';

describe('AmmPoolResolver', () => {
  let resolver: AmmPoolResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmmPoolResolver],
    }).compile();

    resolver = module.get<AmmPoolResolver>(AmmPoolResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
