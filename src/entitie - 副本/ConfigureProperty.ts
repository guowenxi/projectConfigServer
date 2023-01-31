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

  @Column("datetime", { name: "create_time", nullable: true })
  createTime: Date | null;

  @Column("datetime", { name: "update_time", nullable: true })
  updateTime: Date | null;

  @Column("datetime", { name: "deleted_time", nullable: true })
  deletedTime: Date | null;

  @Column("int", {
    name: "isDelete",
    nullable: true,
    comment: "是否真删 0 false  1 true",
  })
  isDelete: number | null;

  @Column("varchar", {
    name: "bind_config_id",
    comment: "绑定的设备表和能耗表的唯一id",
    length: 255,
  })
  bindConfigId: string;
}
