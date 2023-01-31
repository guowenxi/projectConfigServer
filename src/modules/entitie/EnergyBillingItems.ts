import { BaseEntity } from "@modules/commonModule/baseEntity";
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
@Entity("energy_billing_items", { schema: "jy_base" })
export class EnergyBillingItems extends BaseEntity {
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

  // @ManyToOne(
  //   () => EnergyBilling,
  //   (energyBilling) => energyBilling.energyBillingItems,
  //   { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  // )
  // @JoinColumn([{ name: "energy_id", referencedColumnName: "energyId" }])
  // energy: EnergyBilling;
}
