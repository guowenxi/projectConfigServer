import { BaseEntity } from "@modules/commonModule/baseEntity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Attributedictionary } from "./Attributedictionary";

@Index("fk_1", ["attributeId"], {})
@Entity("attributedictionaryitems", { schema: "mynest" })
export class Attributedictionaryitems extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "attribute_id",
    nullable: true,
    comment: "属性表下的uuid用于关联属性表",
    length: 255,
  })
  attributeId: string | null;

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "参数名 下面的各项的name",
    length: 255,
  })
  name: string | null;

  @ManyToOne(
    () => Attributedictionary,
    (attributedictionary) => attributedictionary.attributedictionaryitems,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "attribute_id", referencedColumnName: "attributeId" }])
  attribute: Attributedictionary;
}
