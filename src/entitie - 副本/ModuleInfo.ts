import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("module_info", { schema: "mynest" })
export class ModuleInfo {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "status", default: () => "'1'" })
  status: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("datetime", {
    name: "create_time",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createTime: Date;

  @Column("datetime", { name: "update_time" })
  updateTime: Date;

  @Column("datetime", { name: "delete_time", nullable: true })
  deleteTime: Date | null;

  @Column("int", { name: "is_delete", default: () => "'0'" })
  isDelete: number;

  @Column("int", { name: "agreement_code", nullable: true })
  agreementCode: number | null;
}
