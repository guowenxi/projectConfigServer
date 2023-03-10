import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("point_position", { schema: "mynest" })
export class PointPosition {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

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

  @Column("datetime", { name: "create_time" })
  createTime: Date;

  @Column("datetime", { name: "update_time" })
  updateTime: Date;

  @Column("datetime", { name: "delete_time", nullable: true })
  deleteTime: Date | null;

  @Column("int", { name: "is_delete", default: () => "'0'" })
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
}
