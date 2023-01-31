import { BaseEntity } from "@modules/commonModule/baseEntity";
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EnergyBillingItems } from "./EnergyBillingItems";

@Index("energy_id", ["energyId"], {})
@Entity("energy_billing", { schema: "mynest" })
export class EnergyBilling extends BaseEntity {
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

  @OneToMany(
    () => EnergyBillingItems,
    (energyBillingItems) => energyBillingItems.energy
  )
  energyBillingItems: EnergyBillingItems[];
}
