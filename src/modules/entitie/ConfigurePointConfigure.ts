import { BaseEntity } from "@modules/commonModule/baseEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("configure_point_configure", { schema: "jy_base" })
export class ConfigurePointConfigure extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "点位配置 -- 数据来源于设备组那个表格 ",
  })
  id: number;

  @Column("varchar", {
    name: "bind_config_id",
    nullable: true,
    comment: "绑定的配置表的id",
    length: 255,
  })
  bindConfigId: string | null;

  @Column("int", {
    name: "device_type",
    nullable: true,
    comment: "1 设备表  2 电表 3 水表 ",
  })
  deviceType: number | null;

  @Column("int", {
    name: "device_groupitem_id",
    nullable: true,
    comment: "设备组子表 的 id",
  })
  deviceGroupitemId: number | null;

  @Column("int", { name: "data_source", nullable: true, comment: "数据源下标" })
  dataSource: number | null;

  @Column("varchar", {
    name: "device_group_id",
    nullable: true,
    comment: "设备组表 的 id",
    length: 255,
  })
  deviceGroupId: string | null;
}
