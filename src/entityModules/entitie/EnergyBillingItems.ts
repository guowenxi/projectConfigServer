import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EnergyBilling } from "./EnergyBilling";

@Index("energice_fk1", ["energyId"], {})
@Entity("energy_billing_items", { schema: "mynest" })
export class EnergyBillingItems {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "能耗计费子表" })
  id: number;

  @Column("varchar", { name: "energy_id", comment: "能耗表id", length: 255 })
  energyId: string;

  @Column("datetime", {
    name: "start_time",
    nullable: true,
    comment: "时间段开始时间",
  })
  startTime: Date | null;

  @Column("datetime", {
    name: "end_time",
    nullable: true,
    comment: "时间段结束时间",
  })
  endTime: Date | null;

  @Column("int", {
    name: "time_type",
    nullable: true,
    comment: "电的时间类型 1尖 2峰 3平 4谷",
  })
  timeType: number | null;

  @Column("double", {
    name: " rate",
    comment: "费率",
    precision: 255,
    scale: 0,
  })
  rate: number;

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

  @ManyToOne(
    () => EnergyBilling,
    (energyBilling) => energyBilling.energyBillingItems,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "energy_id", referencedColumnName: "energyId" }])
  energy: EnergyBilling;
}
