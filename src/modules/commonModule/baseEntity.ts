import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class BaseEntity {

  @CreateDateColumn({
    type: 'datetime',
    nullable: false,
    name: 'create_time',
    comment: '创建时间',
    // default: () => "CURRENT_TIMESTAMP()",
    select: false
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'datetime',
    nullable: false,
    name: 'update_time',
    comment: '更新时间',
    // default: () => "'CURRENT_TIMESTAMP()'",
    select: false
  })
  updateTime: Date;

  @DeleteDateColumn({
    type: 'datetime',
    nullable: false,
    name: 'deleted_time',
    comment: '删除时间',
    select: false
  })
  deletedTime: Date;

  @Column("int", {
    name: "is_delete",
    nullable: false,
    comment: "是否真删 0 false  1 true",
    select: false,
    default: () => "'0'",
  })
  isDelete: number | null;
}
