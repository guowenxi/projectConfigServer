import { Test, TestingModule } from '@nestjs/testing';
import { SystemAlarmService } from './system-alarm.service';

describe('SystemAlarmService', () => {
  let service: SystemAlarmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemAlarmService],
    }).compile();

    service = module.get<SystemAlarmService>(SystemAlarmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
