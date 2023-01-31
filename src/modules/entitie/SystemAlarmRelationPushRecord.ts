import { BaseEntity } from "@modules/commonModule/baseEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("system_alarm_relation_push_record", { schema: "jy_base" })
export class SystemAlarmRelationPushRecord extends BaseEntity {

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "push_record_type",
    nullable: true,
    comment: "告警推送类型 1-系统报警 2-规则报警",
  })
  pushRecordType: number | null;

  @Column("int", {
    name: "relation_push_record_id",
    nullable: true,
    comment: "关联告警推送表的id",
  })
  relationPushRecordId: number | null;

  @Column("varchar", {
    name: "relation_alarm_id",
    nullable: true,
    comment: "如果是告警推送类型为1 则关联的是系统报警表的id（system_alarm）",
    length: 245,
  })
  relationAlarmId: string | null;

  @Column("varchar", {
    name: "create_by",
    nullable: true,
    comment: "创建人",
    length: 255,
    select: false
  })
  createBy: string | null;

  @Column("varchar", {
    name: "update_by",
    nullable: true,
    comment: "修改人",
    length: 255,
    select: false
  })
  updateBy: string | null;
}
