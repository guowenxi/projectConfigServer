import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("devicegroupitems", { schema: "mynest" })
export class Devicegroupitems {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "devicegroup_id",
    nullable: true,
    comment: "设备组id",
  })
  devicegroupId: number | null;

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "参数名称",
    length: 255,
  })
  name: string | null;

  @Column("varchar", {
    name: "state_name",
    nullable: true,
    comment: "数据项name",
    length: 255,
  })
  stateName: string | null;

  @Column("int", {
    name: "add_type",
    nullable: true,
    comment: "添加的时候的类型  1 基本参数  2读取  3下发 ",
  })
  addType: number | null;

  @Column("int", { name: "flexd", nullable: true, comment: "0不是 1是" })
  flexd: number | null;

  @Column("int", {
    name: "enable",
    nullable: true,
    comment: "是否启用 0不用 1用",
  })
  enable: number | null;

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
