import { BaseEntity } from "@modules/commonModule/baseEntity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Devicegroup } from "./Devicegroup";

@Index("fk_1", ["deviceGroupId"], {})
@Entity("devicegroupitems", { schema: "jy_base" })
export class Devicegroupitems extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "device_group_id",
    nullable: true,
    comment: "设备组id",
    length: 255,
  })
  deviceGroupId: string | null;

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
    name: "type",
    nullable: true,
    comment: "添加的时候的类型  1 基本参数  2读取  3下发 ",
  })
  type: number | null;

  @Column("int", { name: "flexd", nullable: true, comment: "0不是 1是" })
  flexd: number | null;

  @Column("int", {
    name: "enable",
    nullable: true,
    comment: "是否启用 0不用 1用",
  })
  enable: number | null;

  @ManyToOne(() => Devicegroup, (devicegroup) => devicegroup.devicegroupitems, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "device_group_id", referencedColumnName: "deviceGroupId" },
  ])
  deviceGroup: Devicegroup;
}
