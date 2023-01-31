import { Test, TestingModule } from '@nestjs/testing';
import { SystemAlarmPushService } from './system-alarm-push.service';

describe('SystemAlarmPushService', () => {
  let service: SystemAlarmPushService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemAlarmPushService],
    }).compile();

    service = module.get<SystemAlarmPushService>(SystemAlarmPushService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
