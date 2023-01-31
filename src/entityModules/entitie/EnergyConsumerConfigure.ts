import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("energy_consumer_configure", { schema: "jy_base" })
export class EnergyConsumerConfigure {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "能耗表配置" })
  id: number;

  @Column("varchar", {
    name: "energy_id",
    nullable: true,
    comment: "能耗表配置唯一id",
  })
  energyId: string | null;

  @Column("varchar", {
    name: "device_group_id",
    comment: "关联设备组id",
    length: 255,
  })
  deviceGroupId: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("varchar", {
    name: "energy_number",
    nullable: true,
    comment: "能耗表编号",
  })
  energyNumber: string | null;

  @Column("int", {
    name: "table_type",
    nullable: true,
    comment: "表分类 1 总表 2 分表 ",
  })
  tableType: number | null;

  @Column("varchar", {
    name: "general_table_number",
    nullable: true,
    comment: "总表编号 当选中类别为分表的时候要填写",
  })
  generalTableNumber: string | null;

  @Column("int", {
    name: "bill_method_id",
    nullable: true,
    comment: "计费方式",
  })
  billMethodId: number | null;

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
