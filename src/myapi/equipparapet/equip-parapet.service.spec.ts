import { Test, TestingModule } from '@nestjs/testing';
import { EquipParapetService } from './equip-parapet.service';

describe('EquipParapetService', () => {
  let service: EquipParapetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipParapetService],
    }).compile();

    service = module.get<EquipParapetService>(EquipParapetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
