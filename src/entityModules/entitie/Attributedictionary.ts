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

  @Column("timestamp", {
    name: "deleted_time",
    nullable: true,
    comment: "删除时间",
  })
  deletedTime: Date | null;

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

  @Column("int", {
    name: "is_delete",
    comment: "是否真删 0 false  1 true",
    default: () => "'0'",
  })
  isDelete: number;

  @OneToMany(
    () => Attributedictionaryitems,
    (attributedictionaryitems) => attributedictionaryitems.attribute
  )
  attributedictionaryitems: Attributedictionaryitems[];
}
