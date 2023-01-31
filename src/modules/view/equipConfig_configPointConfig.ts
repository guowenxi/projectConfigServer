import { ConfigurePointBind } from "@modules/entitie/ConfigurePointBind";
import { ConfigurePointConfigure } from "@modules/entitie/ConfigurePointConfigure";
import { PointPosition } from "@modules/entitie/PointPosition";

import { ViewEntity, ViewColumn, Connection } from "typeorm";
// 设备表列表 - 设备绑定表 与 设备配置表 与 点位表 关联

@ViewEntity({
  expression: (connection: Connection) => connection.createQueryBuilder()
    .from(ConfigurePointConfigure, "ConfigurePointConfigure")
    // .innerJoin(ConfigurePointBind, 'ConfigurePointBind', 'ConfigurePointBind.isDelete != 1 AND ConfigurePointBind.pointId = PointPosition.id')
    .leftJoin(PointPosition, 'PointPosition', 'PointPosition.isDelete != 1 AND ConfigurePointConfigure.dataSource = PointPosition.id ')
    .select(`
    ConfigurePointConfigure.id as id,
    ConfigurePointConfigure.bindConfigId as bindConfigId,
    ConfigurePointConfigure.deviceGroupitemId as deviceGroupitemId,
    ConfigurePointConfigure.deviceGroupId as deviceGroupId,
    PointPosition.id as dataSource,
    `)
    .where('ConfigurePointConfigure.isDelete != 1', {})
})

export class equipConfigPointConfigView {

  @ViewColumn()
  id: number;

  // @ViewColumn()
  // bindConfigId: string;

  // @ViewColumn()
  // deviceGroupitemId: number;

  // @ViewColumn()
  // dataSource: number;

  // @ViewColumn()
  // deviceGroupId: string;

}