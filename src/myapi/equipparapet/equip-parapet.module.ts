import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EquipParapetController } from './equip-parapet.controller';
import { EquipParapetService } from './equip-parapet.service';

import { Applytypes } from '@modules/entitie/Applytypes';
import { Attributedictionaryitems } from '@modules/entitie/Attributedictionaryitems';
import { Attributedictionary } from '@modules/entitie/Attributedictionary';
import { ConfigureProperty } from '@modules/entitie/ConfigureProperty';

@Module({
  imports: [TypeOrmModule.forFeature([Attributedictionary, Attributedictionaryitems, Applytypes, ConfigureProperty])],
  controllers: [EquipParapetController],
  providers: [EquipParapetService]
})

export class EquipParapet { }