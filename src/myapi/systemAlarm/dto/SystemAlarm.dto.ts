import { SystemAlarm } from "@modules/entitie/SystemAlarm";
import { SystemAlarmRang } from "@modules/entitie/SystemAlarmRang";

export class SystemAlarmDto extends SystemAlarm {

  // 报警范围的列表页 也可以是一个 都按列表格式传
  SystemAlarmRangs: Array<SystemAlarmRang>

  // 设备的id
  equipIds: Array<string>
}