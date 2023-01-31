import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("equip_configure", { schema: "jy_base" })
export class EquipConfigure {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "设备配置表 主表",
  })
  id: number;

  @Column("varchar", {
    name: "equip_id",
    comment: "设备配置表 关联id",
    length: 255,
  })
  equipId: string;

  @Column("varchar", {
    name: "device_group_id",
    comment: "关联设备组id",
    length: 255,
  })
  deviceGroupId: string;

  @Column("varchar", {
    name: "device_group_name",
    nullable: true,
    comment: "关联设备的name",
    length: 255,
  })
  deviceGroupName: string | null;

  @Column("varchar", {
    name: "equip_number",
    nullable: true,
    comment: "设备编号",
    length: 255,
  })
  equipNumber: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", {
    name: "equip_type",
    comment: "设备类型\r\n1 普通设备表\r\n2 电表\r\n3 水表",
  })
  equipType: number;

  @Column("varchar", {
    name: "charging_methods_id",
    comment: "计费方式的id （能耗表使用）",
    length: 255,
  })
  chargingMethodsId: string;

  @Column("varchar", {
    name: "electricitymeter_number",
    nullable: true,
    comment: "总表编号 当为分表的时候有效（电表使用）",
    length: 255,
  })
  electricitymeterNumber: string | null;

  @Column("int", {
    name: "electricitymeter_type",
    comment: "电表类型 1 分表 2 总表  （电表使用）",
  })
  electricitymeterType: number;

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
}
