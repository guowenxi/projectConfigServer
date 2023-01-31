import { Test, TestingModule } from '@nestjs/testing';
import { EnergyMeterConfigureService } from './energy-meter-configure.service';

describe('EnergyMeterConfigureService', () => {
  let service: EnergyMeterConfigureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnergyMeterConfigureService],
    }).compile();

    service = module.get<EnergyMeterConfigureService>(EnergyMeterConfigureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
