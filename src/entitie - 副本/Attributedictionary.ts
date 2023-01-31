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
export class Attributedictionary {
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

  @OneToMany(
    () => Attributedictionaryitems,
    (attributedictionaryitems) => attributedictionaryitems.attribute
  )
  attributedictionaryitems: Attributedictionaryitems[];
}
