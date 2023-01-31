import { Test, TestingModule } from '@nestjs/testing';
import { EquipParapetController } from './equip-parapet.controller';

describe('EquipParapetController', () => {
  let controller: EquipParapetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipParapetController],
    }).compile();

    controller = module.get<EquipParapetController>(EquipParapetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
