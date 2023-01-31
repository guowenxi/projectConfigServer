import { Test, TestingModule } from '@nestjs/testing';
import { EquipConfigureService } from './equip-configure.service';

describe('EquipConfigureService', () => {
  let service: EquipConfigureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipConfigureService],
    }).compile();

    service = module.get<EquipConfigureService>(EquipConfigureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
