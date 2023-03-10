import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("equip_configure", { schema: "mynest" })
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
}
