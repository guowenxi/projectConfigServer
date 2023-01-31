import { BaseEntity } from "@modules/commonModule/baseEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("system_alarm_rang", { schema: "jy_base" })
export class SystemAlarmRang extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "alarm_id",
    comment: "系统报警表的唯一id 关联id",
    length: 366,
  })
  alarmId: string;

  @Column("varchar", {
    name: "prompt_text",
    nullable: true,
    comment: "提示文本",
    length: 255,
  })
  promptText: string | null;

  @Column("int", {
    name: "emerge_degree_type",
    nullable: true,
    comment: "紧急程度 type 1 一般   2  紧急 ",
    default: () => "'1'",
  })
  emergeDegreeType: number | null;

  @Column("double", {
    name: "warn_value",
    comment: "报警值",
    precision: 255,
    scale: 0,
  })
  warnValue: number;

  @Column("int", {
    name: "alarm_rang_type",
    nullable: true,
    comment: "报警范围类型 1 开关量  2 模拟量",
  })
  alarmRangType: number | null;

  @Column("int", {
    name: "warn_type",
    nullable: true,
    comment: "模拟量 报警类型 1 低低 2 低 3 高 4 高高",
  })
  warnType: number | null;
}
