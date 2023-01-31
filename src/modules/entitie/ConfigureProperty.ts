import { BaseEntity } from "@modules/commonModule/baseEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("configure_property", { schema: "jy_base" })
export class ConfigureProperty extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "配置属性表 设备管理中动态属性都来这个表中",
  })
  id: number;

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "参数名称",
    length: 255,
  })
  name: string | null;

  @Column("varchar", {
    name: "attribute_id",
    nullable: true,
    comment: "参数id",
    length: 255,
  })
  attributeId: string | null;

  @Column("int", {
    name: "value_id",
    nullable: true,
    comment: "参数值 来源于 属性表子表id",
  })
  valueId: number | null;

  @Column("varchar", {
    name: "value",
    nullable: true,
    comment: "参数值name 来源于 属性表name",
    length: 255,
  })
  value: string | null;

  @Column("varchar", {
    name: "bind_config_id",
    comment: "绑定的设备表和能耗表的唯一id",
    length: 255,
  })
  bindConfigId: string;
}
