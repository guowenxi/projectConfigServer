
import { Attributedictionary } from '@modules/entitie/Attributedictionary';
import { Attributedictionaryitems } from '@modules/entitie/Attributedictionaryitems';
import { ConfigurePointBind } from '@modules/entitie/ConfigurePointBind';
import { ConfigurePointConfigure } from '@modules/entitie/ConfigurePointConfigure';
import { ConfigureProperty } from '@modules/entitie/ConfigureProperty';
import { Devicegroup } from '@modules/entitie/Devicegroup';
import { Devicegroupitems } from '@modules/entitie/Devicegroupitems';
import { EquipConfigure } from '@modules/entitie/EquipConfigure';
import { ModuleInfo } from '@modules/entitie/ModuleInfo';
import { PointPosition } from '@modules/entitie/PointPosition';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipConfigureController } from './equip-configure.controller';
import { EquipConfigureService } from './equip-configure.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Attributedictionary, Attributedictionaryitems,
    Devicegroup, Devicegroupitems,
    ConfigurePointConfigure,
    ConfigureProperty,
    ConfigurePointBind,
    ModuleInfo,
    PointPosition,

    EquipConfigure,
  ])],
  controllers: [EquipConfigureController],
  providers: [EquipConfigureService]
})
export class EquipConfigureModule { }
