
import { Devicegroup } from "@modules/entitie/Devicegroup";
import { EnergyBilling } from "@modules/entitie/EnergyBilling";
import { EquipConfigure } from "@modules/entitie/EquipConfigure";
import { ViewEntity, ViewColumn, Connection } from "typeorm";
// 设备表列表 - 设备表和设备组 select 信息 

@ViewEntity({
  expression: (connection: Connection) => connection.createQueryBuilder()
    .from(EquipConfigure, "EquipConfigure")
    .leftJoin(Devicegroup, 'Devicegroup', 'Devicegroup.deviceGroupId = EquipConfigure.deviceGroupId AND Devicegroup.isDelete != 1')
    .leftJoin(EnergyBilling, 'EnergyBilling', 'EnergyBilling.energyId = EquipConfigure.chargingMethodsId AND EnergyBilling.isDelete != 1')
    .select(`
          Devicegroup.name as deviceGroupName,
          Devicegroup.deviceGroupId as deviceGroupId,
          EnergyBilling.name as chargingMethodsValue,
          EquipConfigure.equipId as equipId,
          EquipConfigure.equipNumber as equipNumber,
          EquipConfigure.name as name,
          EquipConfigure.id as id,
          EquipConfigure.equipType as equipType
    `)
    .where('EquipConfigure.isDelete != 1', {})
})

export class equipView {
  @ViewColumn()
  deviceGroupName: String;

  @ViewColumn()
  deviceGroupId: String;

  @ViewColumn()
  chargingMethodsValue: String;

  @ViewColumn()
  equipId: String;

  @ViewColumn()
  equipNumber: String;

  @ViewColumn()
  name: String;

  @ViewColumn()
  id: number;

  @ViewColumn()
  equipType: number;

}