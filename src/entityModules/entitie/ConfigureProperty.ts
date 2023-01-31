import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("configure_property", { schema: "mynest" })
export class ConfigureProperty {
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

  @Column("int", {
    name: "is_delete",
    comment: "是否真删 0 false  1 true",
    default: () => "'0'",
  })
  isDelete: number;

  @Column("timestamp", {
    name: "create_time",
    comment: "创建时间",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createTime: Date;

  @Column("timestamp", {
    name: "update_time",
    comment: "更新时间",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  updateTime: Date;

  @Column("timestamp", {
    name: "deleted_time",
    nullable: true,
    comment: "删除时间",
  })
  deletedTime: Date | null;

  @Column("varchar", {
    name: "attribute_id",
    nullable: true,
    comment: "参数id",
    length: 255,
  })
  attributeId: string | null;
}
