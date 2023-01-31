import { Test, TestingModule } from '@nestjs/testing';
import { ElectricityMeterConfigureService } from './electricity-meter-configure.service';

describe('ElectricityMeterConfigureService', () => {
  let service: ElectricityMeterConfigureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElectricityMeterConfigureService],
    }).compile();

    service = module.get<ElectricityMeterConfigureService>(ElectricityMeterConfigureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
