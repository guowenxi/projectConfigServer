import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Applytypes } from "./Applytypes";
import { Devicegroupitems } from "./Devicegroupitems";

@Index("device_group_id", ["deviceGroupId"], {})
@Index("fk1", ["type"], {})
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

  @Column("varchar", { name: "name", comment: "名称", length: 255 })
  name: string;

  @Column("int", { name: "type", comment: "设备组类型" })
  type: number;

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

  @ManyToOne(() => Applytypes, (applytypes) => applytypes.devicegroups, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "type", referencedColumnName: "id" }])
  type2: Applytypes;

  @OneToMany(
    () => Devicegroupitems,
    (devicegroupitems) => devicegroupitems.deviceGroup
  )
  devicegroupitems: Devicegroupitems[];
}
