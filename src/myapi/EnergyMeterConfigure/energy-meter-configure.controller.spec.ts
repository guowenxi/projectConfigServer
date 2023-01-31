import { Test, TestingModule } from '@nestjs/testing';
import { EnergyMeterConfigureController } from './energy-meter-configure.controller';

describe('EnergyMeterConfigureController', () => {
  let controller: EnergyMeterConfigureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnergyMeterConfigureController],
    }).compile();

    controller = module.get<EnergyMeterConfigureController>(EnergyMeterConfigureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
