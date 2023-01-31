import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("module_info", { schema: "mynest" })
export class ModuleInfo {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "status", comment: "模块状态", default: () => "'1'" })
  status: number;

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "模块名称",
    length: 255,
  })
  name: string | null;

  @Column("int", {
    name: "is_delete",
    comment: "删除标识",
    default: () => "'0'",
  })
  isDelete: number;

  @Column("int", {
    name: "agreement_code",
    nullable: true,
    comment: "通讯协议编号",
  })
  agreementCode: number | null;

  @Column("datetime", {
    name: "create_time",
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createTime: Date;

  @Column("datetime", {
    name: "update_time",
    comment: "修改时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  updateTime: Date;

  @Column("datetime", {
    name: "delete_time",
    nullable: true,
    comment: "删除时间",
  })
  deleteTime: Date | null;
}
