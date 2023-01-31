import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Devicegroup } from "./Devicegroup";

@Entity("applytypes", { schema: "jy_base" })
export class Applytypes {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "设备管理中的类型",
    length: 255,
  })
  name: string | null;

  @Column("int", {
    name: "type",
    nullable: true,
    comment:
      "类型 \r\n\r\n1 应用类型 \r\n2 设备类型 \r\n3 能耗表类型 \r\n4 能耗表配置-计费方式",
  })
  type: number | null;

  @Column("int", {
    name: "type_id",
    nullable: true,
    comment: "类型id用于 下拉框中使用",
  })
  typeId: number | null;

  @Column("datetime", {
    name: "create_time",
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createTime: Date;

  @Column("datetime", {
    name: "update_time",
    comment: "更新时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  updateTime: Date;

  @Column("datetime", {
    name: "deleted_time",
    nullable: true,
    comment: "删除时间",
  })
  deletedTime: Date | null;

  @Column("int", {
    name: "is_delete",
    comment: "是否真删 0 false  1 true",
    default: () => "'0'",
  })
  isDelete: number;

  @OneToMany(() => Devicegroup, (devicegroup) => devicegroup.type2)
  devicegroups: Devicegroup[];
}
