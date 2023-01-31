
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigurePointConfigure } from '@modules/entitie/ConfigurePointConfigure';
import { DeviceDataitemDictionaries } from '@modules/entitie/DeviceDataitemDictionaries';
import { Devicegroup } from '@modules/entitie/Devicegroup';
import { Devicegroupitems } from '@modules/entitie/Devicegroupitems';
import { ElectroMeterConfigure } from '@modules/entitie/ElectroMeterConfigure';
import { EquipConfigure } from '@modules/entitie/EquipConfigure';
import { PointPosition } from '@modules/entitie/PointPosition';
import { WaterMeterConfigure } from '@modules/entitie/WaterMeterConfigure';

import { Applytypes } from '@modules/entitie/Applytypes';
import { DeviceGroupController } from './device-group.controller';
import { DeviceGroupService } from './device-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Devicegroup, Devicegroupitems,
    DeviceDataitemDictionaries,
    Applytypes,
    DeviceDataitemDictionaries,
    EquipConfigure,
    ConfigurePointConfigure,
    PointPosition,
    ElectroMeterConfigure,
    WaterMeterConfigure
  ])],
  controllers: [DeviceGroupController],
  providers: [DeviceGroupService]
})

export class DeviceGroupModule { }