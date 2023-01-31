import { Test, TestingModule } from '@nestjs/testing';
import { EquipConfigureController } from './equip-configure.controller';

describe('EquipConfigureController', () => {
  let controller: EquipConfigureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipConfigureController],
    }).compile();

    controller = module.get<EquipConfigureController>(EquipConfigureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
