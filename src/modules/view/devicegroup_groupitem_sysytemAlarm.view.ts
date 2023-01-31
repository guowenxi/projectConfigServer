import { ViewEntity, ViewColumn, Connection } from "typeorm";

import { SystemAlarm } from "@modules/entitie/SystemAlarm";
import { Devicegroup } from '@modules/entitie/Devicegroup';
import { Devicegroupitems } from '@modules/entitie/Devicegroupitems';
@ViewEntity({
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select(" Devicegroup.name", "DeviceGroupName")
    .addSelect(" Devicegroupitems.name ", "DevicegroupitemsName")
    .addSelect(" SystemAlarm.alarmId ", "alarmId")
    .from(SystemAlarm, "SystemAlarm")
    .leftJoin(Devicegroup, "Devicegroup", "Devicegroup.deviceGroupId = SystemAlarm.deviceGroupId AND Devicegroup.isDelete != 1")
    .leftJoin(Devicegroupitems, "Devicegroupitems",
      "Devicegroupitems.id = SystemAlarm.deviceGroupitemId AND Devicegroupitems.isDelete != 1 AND Devicegroupitems.deviceGroupId = SystemAlarm.deviceGroupId")
})

export class devicegroup_groupitem_sysytemAlarmView {
  @ViewColumn()
  alarmId: String;

  @ViewColumn()
  DeviceGroupName: String;

  @ViewColumn()
  DevicegroupitemsName: String;
}