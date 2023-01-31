import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("configure_point_configure", { schema: "jy_base" })
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
