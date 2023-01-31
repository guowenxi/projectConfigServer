import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("configure_point_configure", { schema: "mynest" })
export class ConfigurePointConfigure {
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
    name: "device_groupitem_id",
    nullable: true,
    comment: "设备组子表 的 id",
  })
  deviceGroupitemId: number | null;

  @Column("int", { name: "data_source", nullable: true, comment: "数据源下标" })
  dataSource: number | null;

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

  @Column("varchar", {
    name: "device_group_id",
    nullable: true,
    comment: "设备组表 的 id",
    length: 255,
  })
  deviceGroupId: string | null;
}
