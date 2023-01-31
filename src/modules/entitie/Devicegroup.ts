import { BaseEntity } from "@modules/commonModule/baseEntity";
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
@Entity("devicegroup", { schema: "jy_base" })
export class Devicegroup extends BaseEntity {
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
    nullable: false,
    comment: "名称",
    length: 255,
  })
  name: string;

  @Column("int", { name: "type", nullable: false, comment: "设备组类型" })
  type: number;

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
