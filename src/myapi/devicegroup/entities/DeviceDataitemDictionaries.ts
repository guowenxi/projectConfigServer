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
    name: "flexd",
    nullable: true,
    comment: "固定项 0 非固定 1固定",
  })
  flexd: number | null;

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
