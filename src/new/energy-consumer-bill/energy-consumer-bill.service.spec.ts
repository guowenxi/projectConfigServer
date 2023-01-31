import { Test, TestingModule } from '@nestjs/testing';
import { EnergyConsumerBillService } from './energy-consumer-bill.service';

describe('EnergyConsumerBillService', () => {
  let service: EnergyConsumerBillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnergyConsumerBillService],
    }).compile();

    service = module.get<EnergyConsumerBillService>(EnergyConsumerBillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
