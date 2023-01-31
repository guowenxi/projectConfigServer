import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("devicegroup", { schema: "mynest" })
export class Devicegroup {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "device_group_id",
    nullable: true,
    comment: "设备组关联id",
    length: 255,
  })
  deviceGroupId: string | null;

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "名称",
    length: 255,
  })
  name: string | null;

  @Column("int", { name: "type", nullable: true, comment: "设备组类型" })
  type: number | null;

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
