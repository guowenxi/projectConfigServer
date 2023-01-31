import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("energy_id", ["energyId"], {})
@Entity("energy_billing", { schema: "jy_base" })
export class EnergyBilling {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "能耗计费主表" })
  id: number;

  @Column("varchar", { name: "energy_id", comment: "能耗计费id", length: 255 })
  energyId: string;

  @Column("varchar", { name: "name", comment: "计费方式名称", length: 255 })
  name: string;

  @Column("int", { name: "type", comment: "能耗表类型" })
  type: number;

  @Column("double", {
    name: "rate",
    nullable: true,
    comment: "费率",
    precision: 255,
    scale: 0,
  })
  rate: number | null;

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
