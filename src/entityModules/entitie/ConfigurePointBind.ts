import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("configure_point_bind", { schema: "jy_base" })
export class ConfigurePointBind {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "bind_configure_id",
    comment: "绑定的配置表id",
    length: 255,
  })
  bindConfigureId: string;

  @Column("int", { name: "point_id", nullable: true, comment: "点位表的id" })
  pointId: number | null;

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
}
