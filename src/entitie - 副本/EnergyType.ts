import { Column, Entity } from "typeorm";

@Entity("energy_type", { schema: "mynest" })
export class EnergyType {
  @Column("int", { primary: true, name: "id", comment: "主键" })
  id: number;

  @Column("int", { name: "pid", comment: "父id" })
  pid: number;

  @Column("varchar", { name: "name", comment: "字典名称", length: 50 })
  name: string;

  @Column("tinyint", {
    name: "fixed",
    comment: "是否为固定项（0-false 1-true）",
    width: 1,
  })
  fixed: boolean;

  @Column("varchar", {
    name: "note",
    nullable: true,
    comment: "说明",
    length: 255,
  })
  note: string | null;

  @Column("int", {
    name: "creator_account",
    nullable: true,
    comment: "创建用户id",
  })
  creatorAccount: number | null;

  @Column("datetime", {
    name: "create_time",
    nullable: true,
    comment: "创建时间",
  })
  createTime: Date | null;

  @Column("int", {
    name: "modify_account",
    nullable: true,
    comment: "修改用户id",
  })
  modifyAccount: number | null;

  @Column("datetime", {
    name: "modify_time",
    nullable: true,
    comment: "修改时间",
  })
  modifyTime: Date | null;

  @Column("int", {
    name: "delete_state",
    comment: "是否删除 1201：是 1202 否",
    default: () => "'1202'",
  })
  deleteState: number;

  @Column("datetime", {
    name: "date_delete",
    nullable: true,
    comment: "删除时间",
  })
  dateDelete: Date | null;
}
