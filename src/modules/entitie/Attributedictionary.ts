import { BaseEntity } from "@modules/commonModule/baseEntity";
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Attributedictionaryitems } from "./Attributedictionaryitems";

@Index("uuid", ["attributeId"], {})
@Entity("attributedictionary", { schema: "mynest" })
export class Attributedictionary extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "attribute_id", length: 255 })
  attributeId: string;

  @Column("varchar", {
    name: "param_name",
    nullable: true,
    comment: "参数名称",
    length: 255,
  })
  paramName: string | null;

  @Column("varchar", {
    name: "apply_type",
    nullable: true,
    comment: "绑定的应用的类型 来源applytypes",
    length: 255,
  })
  applyType: string | null;

  @OneToMany(
    () => Attributedictionaryitems,
    (attributedictionaryitems) => attributedictionaryitems.attribute
  )
  attributedictionaryitems: Attributedictionaryitems[];
}
