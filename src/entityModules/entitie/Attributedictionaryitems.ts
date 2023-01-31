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

  @Column("int", {
    name: "is_delete",
    comment: "是否真删 0 false  1 true",
    default: () => "'0'",
  })
  isDelete: number;

  @ManyToOne(
    () => Attributedictionary,
    (attributedictionary) => attributedictionary.attributedictionaryitems,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "attribute_id", referencedColumnName: "attributeId" }])
  attribute: Attributedictionary;
}
