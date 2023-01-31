import { BaseEntity } from "@modules/commonModule/baseEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("configure_point_bind", { schema: "jy_base" })
export class ConfigurePointBind extends BaseEntity {
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

}
