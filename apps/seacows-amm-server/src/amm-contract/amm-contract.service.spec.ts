import { Test, TestingModule } from '@nestjs/testing';
import { AmmContractService } from './amm-contract.service';
import { Web3Module } from 'nest-web3';

describe('AmmContractService', () => {
  let service: AmmContractService;
  const tx =
    '0x1bd03da3213102bec2b046f4c159a977e637ffa0645a50559f2abcc691fe0814';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        Web3Module.forRoot({
          name: 'eth',
          url: 'https://rinkeby.infura.io/v3/9a3f14b3724843eba39371fa3886319b',
        }),
      ],
      providers: [AmmContractService],
    }).compile();

    service = module.get<AmmContractService>(AmmContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be success', async () => {
    const response = await service.getPoolAddress(tx);
    console.log(response);
    expect(response).toBe('0x878620BA69c7B945D0790da2e9EB0a2D10553D5e');
  });
});
