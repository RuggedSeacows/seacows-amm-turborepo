import { Test, TestingModule } from '@nestjs/testing';
import { EventRecorderService } from './event-recorder.service';
import { Web3Module } from 'nest-web3';
describe('EventRecorderService', () => {
  let service: EventRecorderService;
  const factoryAddress = '0x4AA65D5886Cb59Df1616E86fEC1fFe01b7Ece5B7';
  beforeEach(async () => {
    const web3Module = Web3Module.forRoot({
      name: 'Goerli',
      url: 'https://eth-goerli.g.alchemy.com/v2/-bB-PmLODMFTOBn_29826EICqKjRqZYa',
    });
    const module: TestingModule = await Test.createTestingModule({
      imports: [web3Module],
      providers: [EventRecorderService],
    }).compile();

    service = module.get<EventRecorderService>(EventRecorderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it(
    'should be getHistoryPoolInfo',
    async () => {
      const response = await service.getHistoryPoolInfo({
        address: factoryAddress,
      });
      console.log(response);
      expect(response.length).toBeGreaterThan(0);
    },
    30 * 1000
  );
});
