import { SystemAlarmBindConfig } from "@modules/entitie/SystemAlarmBindConfig";
import { EquipConfigure } from '@modules/entitie/EquipConfigure';
import { ViewEntity, ViewColumn, Connection } from "typeorm";

@ViewEntity({
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select("EquipConfigure.equipId", "equipId")
    .addSelect("EquipConfigure.name", "name")
    .addSelect("SystemAlarmBindConfig.alarmId", "alarmId")
    .from(SystemAlarmBindConfig, "SystemAlarmBindConfig")
    .leftJoin(EquipConfigure, "EquipConfigure", "EquipConfigure.equipId = SystemAlarmBindConfig.bindConfigureId")
})

export class equipConfigAndSystemAlarmBindConfigView {

  @ViewColumn()
  alarmId: String;

  @ViewColumn()
  equipId: String;

  @ViewColumn()
  name: string;
}