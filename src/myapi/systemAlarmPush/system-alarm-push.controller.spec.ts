import { Test, TestingModule } from '@nestjs/testing';
import { SystemAlarmPushController } from './system-alarm-push.controller';

describe('SystemAlarmPushController', () => {
  let controller: SystemAlarmPushController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemAlarmPushController],
    }).compile();

    controller = module.get<SystemAlarmPushController>(SystemAlarmPushController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
