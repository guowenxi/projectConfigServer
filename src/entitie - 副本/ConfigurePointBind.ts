import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("configure_point_bind", { schema: "mynest" })
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
