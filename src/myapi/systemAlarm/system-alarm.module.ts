import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemAlarmController } from './system-alarm.controller';
import { SystemAlarmService } from './system-alarm.service';

import { SystemAlarm } from '@modules/entitie/SystemAlarm';
import { SystemAlarmRang } from '@modules/entitie/SystemAlarmRang';
import { SystemAlarmBindConfig } from '@modules/entitie/SystemAlarmBindConfig';
import { Devicegroup } from '@modules/entitie/Devicegroup';
import { Devicegroupitems } from '@modules/entitie/Devicegroupitems';
import { EquipConfigure } from '@modules/entitie/EquipConfigure';
import { ConfigurePointConfigure } from '@modules/entitie/ConfigurePointConfigure';

import { equipConfigAndSystemAlarmBindConfigView } from '@modules/view/equipConfigAndSystemAlarmBindConfig.view';
import { devicegroup_groupitem_sysytemAlarmView } from '@modules/view/devicegroup_groupitem_sysytemAlarm.view';

@Module({
  imports: [TypeOrmModule.forFeature([
    SystemAlarm,
    SystemAlarmRang,
    SystemAlarmBindConfig,
    Devicegroup, Devicegroupitems,
    ConfigurePointConfigure,
    EquipConfigure,

    equipConfigAndSystemAlarmBindConfigView,
    devicegroup_groupitem_sysytemAlarmView
  ])],
  controllers: [SystemAlarmController],
  providers: [SystemAlarmService]
})
export class SystemAlarmModule { }
