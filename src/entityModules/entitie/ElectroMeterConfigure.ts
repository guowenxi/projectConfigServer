import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("electro_id", ["equipId"], {})
@Entity("electro_meter_configure", { schema: "mynest" })
export class ElectroMeterConfigure {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "equip_id",
    comment: "能耗表 - 电表唯一id",
    length: 255,
  })
  equipId: string;

  @Column("varchar", { name: "name", comment: "设备名称", length: 255 })
  name: string;

  @Column("varchar", {
    name: "device_group_id",
    comment: "关联设备组id",
    length: 255,
  })
  deviceGroupId: string;

  @Column("varchar", {
    name: "device_group_name",
    nullable: true,
    comment: "关联设备组的name",
    length: 255,
  })
  deviceGroupName: string | null;

  @Column("int", {
    name: "electricitymeter_type",
    comment: "电表类型 1 分表 2 总表 ",
  })
  electricitymeterType: number;

  @Column("varchar", {
    name: "equip_number",
    nullable: true,
    comment: "设备编号",
    length: 255,
  })
  equipNumber: string | null;

  @Column("int", {
    name: "is_delete",
    comment: "是否真删 0 false  1 true",
    default: () => "'0'",
  })
  isDelete: number;

  @Column("varchar", {
    name: "electricitymeter_number",
    nullable: true,
    comment: "总表编号 当为分表的时候有效",
    length: 255,
  })
  electricitymeterNumber: string | null;

  @Column("varchar", {
    name: "charging_methods_id",
    comment: "计费方式的id",
    length: 255,
  })
  chargingMethodsId: string;

  @Column("varchar", {
    name: "charging_methods_value",
    nullable: true,
    comment: "计费方式的值",
    length: 255,
  })
  chargingMethodsValue: string | null;

  @Column("timestamp", {
    name: "deleted_time",
    nullable: true,
    comment: "删除时间",
  })
  deletedTime: Date | null;

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
}
