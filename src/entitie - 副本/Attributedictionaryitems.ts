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
export class Attributedictionaryitems {
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

  @Column("datetime", { name: "create_time", nullable: true })
  createTime: Date | null;

  @Column("datetime", { name: "update_time", nullable: true })
  updateTime: Date | null;

  @Column("datetime", { name: "deleted_time", nullable: true })
  deletedTime: Date | null;

  @Column("int", {
    name: "isDelete",
    nullable: true,
    comment: "是否真删 0 false  1 true",
  })
  isDelete: number | null;

  @ManyToOne(
    () => Attributedictionary,
    (attributedictionary) => attributedictionary.attributedictionaryitems,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "attribute_id", referencedColumnName: "attributeId" }])
  attribute: Attributedictionary;
}
