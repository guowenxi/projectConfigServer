import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attributedictionary } from '@modules/entitie/Attributedictionary';
import { Attributedictionaryitems } from '@modules/entitie/Attributedictionaryitems';
import { ConfigurePointBind } from '@modules/entitie/ConfigurePointBind';
import { ConfigurePointConfigure } from '@modules/entitie/ConfigurePointConfigure';
import { ConfigureProperty } from '@modules/entitie/ConfigureProperty';
import { Devicegroup } from '@modules/entitie/Devicegroup';
import { Devicegroupitems } from '@modules/entitie/Devicegroupitems';
import { ModuleInfo } from '@modules/entitie/ModuleInfo';
import { PointPosition } from '@modules/entitie/PointPosition';
import { EnergyBilling } from '@modules/entitie/EnergyBilling';

import { EnergyMeterConfigureController } from './energy-meter-configure.controller';
import { EnergyMeterConfigureService } from './energy-meter-configure.service';
import { EquipConfigure } from '@modules/entitie/EquipConfigure';


@Module({
  imports: [TypeOrmModule.forFeature([
    Attributedictionary, Attributedictionaryitems,
    Devicegroup, Devicegroupitems,
    ConfigurePointConfigure,
    ConfigureProperty,
    ModuleInfo,
    ConfigurePointBind,
    PointPosition,
    EnergyBilling,
    EquipConfigure,
  ])],
  controllers: [EnergyMeterConfigureController],
  providers: [EnergyMeterConfigureService]
})
export class EnergyMeterConfigureModule { }
