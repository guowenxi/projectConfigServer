import { Test, TestingModule } from '@nestjs/testing';
import { SystemAlarmController } from './system-alarm.controller';

describe('SystemAlarmController', () => {
  let controller: SystemAlarmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemAlarmController],
    }).compile();

    controller = module.get<SystemAlarmController>(SystemAlarmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
