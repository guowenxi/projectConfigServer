import { Test, TestingModule } from '@nestjs/testing';
import { EnergyConsumerBillController } from './energy-consumer-bill.controller';

describe('EnergyConsumerBillController', () => {
  let controller: EnergyConsumerBillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnergyConsumerBillController],
    }).compile();

    controller = module.get<EnergyConsumerBillController>(EnergyConsumerBillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
