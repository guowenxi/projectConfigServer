
import { Attributedictionary } from "@modules/entitie/Attributedictionary";
import { Attributedictionaryitems } from "@modules/entitie/Attributedictionaryitems";
import { ConfigureProperty } from "@modules/entitie/ConfigureProperty";
import { ViewEntity, ViewColumn, Connection } from "typeorm";
// 设备表列表 - 设备属性表的select

@ViewEntity({
  expression: (connection: Connection) => connection.createQueryBuilder()
    .from(ConfigureProperty, "ConfigureProperty")
    .leftJoin(Attributedictionary, 'Attributedictionary', 'Attributedictionary.attributeId = ConfigureProperty.attributeId AND Attributedictionary.isDelete != 1')
    .leftJoin(Attributedictionaryitems, 'Attributedictionaryitems', 'Attributedictionaryitems.id = ConfigureProperty.valueId AND Attributedictionaryitems.isDelete != 1')
    .select(`
    Attributedictionary.attributeId as attributeId,
    ConfigureProperty.bindConfigId as bindConfigId,
    ConfigureProperty.id as id,
    Attributedictionary.paramName as name,
    Attributedictionaryitems.name as value,
    ConfigureProperty.valueId as valueId
    `)
    .where('ConfigureProperty.isDelete != 1', {})
})

export class equipAttributeView {

  @ViewColumn()
  attributeId: String;

  @ViewColumn()
  bindConfigId: String;

  @ViewColumn()
  id: number;

  @ViewColumn()
  name: String;

  @ViewColumn()
  value: String;

  @ViewColumn()
  valueId: number;

}