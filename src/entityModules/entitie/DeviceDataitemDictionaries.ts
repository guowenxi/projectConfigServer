import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("device_dataitem_dictionaries", { schema: "jy_base" })
export class DeviceDataitemDictionaries {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

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
    comment: "分项类型  1 基本参数 2 读取 3 下发",
  })
  type: number | null;

  @Column("int", {
    name: "equip_type_id",
    nullable: true,
    comment: "设备类型 ",
  })
  equipTypeId: number | null;

  @Column("int", {
    name: "flexd",
    nullable: true,
    comment: "固定项 0 非固定 1固定",
  })
  flexd: number | null;

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

  @Column("varchar", {
    name: "equip_type_value",
    nullable: true,
    comment: "设备类型name",
    length: 255,
  })
  equipTypeValue: string | null;
}
