import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_info", { schema: "jy_base" })
export class UserInfo {
  @Column("int", {
    name: "is_delete",
    comment: "删除标识",
    default: () => "'0'",
  })
  isDelete: number;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "username", length: 255 })
  username: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "phone", length: 255 })
  phone: string;

  @Column("int", { name: "roleId" })
  roleId: number;

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
