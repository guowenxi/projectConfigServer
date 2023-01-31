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

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "设备名称",
    length: 255,
  })
  name: string | null;

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
    nullable: true,
    comment: "电表类型 1 分表 2 总表 ",
  })
  electricitymeterType: number | null;

  @Column("varchar", {
    name: "equip_number",
    nullable: true,
    comment: "设备编号",
    length: 255,
  })
  equipNumber: string | null;

  @Column("datetime", { name: "create_time", nullable: true })
  createTime: Date | null;

  @Column("datetime", { name: "update_time", nullable: true })
  updateTime: Date | null;

  @Column("datetime", { name: "delete_time", nullable: true })
  deleteTime: Date | null;

  @Column("int", {
    name: "isDelete",
    nullable: true,
    comment: "是否真删 0 false  1 true",
  })
  isDelete: number | null;

  @Column("varchar", {
    name: "electricitymeter_number",
    nullable: true,
    comment: "总表编号 当为分表的时候有效",
    length: 255,
  })
  electricitymeterNumber: string | null;

  @Column("varchar", {
    name: "charging_methods_id",
    nullable: true,
    comment: "计费方式的id",
    length: 255,
  })
  chargingMethodsId: string | null;

  @Column("varchar", {
    name: "charging_methods_value",
    nullable: true,
    comment: "计费方式的值",
    length: 255,
  })
  chargingMethodsValue: string | null;
}
