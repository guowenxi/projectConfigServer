import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("point_position", { schema: "mynest" })
export class PointPosition {
  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("varchar", { name: "unit", nullable: true, length: 255 })
  unit: string | null;

  @Column("varchar", { name: "address", nullable: true, length: 255 })
  address: string | null;

  @Column("varchar", { name: "explain", nullable: true, length: 255 })
  explain: string | null;

  @Column("varchar", { name: "value", nullable: true, length: 255 })
  value: string | null;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "is_delete",
    comment: "删除标识",
    default: () => "'0'",
  })
  isDelete: number;

  @Column("int", { name: "module_id", nullable: true })
  moduleId: number | null;

  @Column("int", { name: "equipment_id", nullable: true })
  equipmentId: number | null;

  @Column("int", { name: "point_type", nullable: true })
  pointType: number | null;

  @Column("int", { name: "register_type", nullable: true })
  registerType: number | null;

  @Column("int", { name: "data_type", nullable: true })
  dataType: number | null;

  @Column("varchar", { name: "convert_ratio", nullable: true, length: 255 })
  convertRatio: string | null;

  @Column("varchar", { name: "convert_benchmark", nullable: true, length: 255 })
  convertBenchmark: string | null;

  @Column("varchar", { name: "quality_stamp", nullable: true, length: 255 })
  qualityStamp: string | null;

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

  @Column("datetime", {
    name: "create_time",
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createTime: Date;
}
