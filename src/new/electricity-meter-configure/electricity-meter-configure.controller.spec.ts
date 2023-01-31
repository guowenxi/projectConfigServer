import { Test, TestingModule } from '@nestjs/testing';
import { ElectricityMeterConfigureController } from './electricity-meter-configure.controller';

describe('ElectricityMeterConfigureController', () => {
  let controller: ElectricityMeterConfigureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElectricityMeterConfigureController],
    }).compile();

    controller = module.get<ElectricityMeterConfigureController>(ElectricityMeterConfigureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
