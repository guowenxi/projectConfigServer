import { BaseEntity } from "@modules/commonModule/baseEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("system_alarm_push_record", { schema: "jy_base" })
export class SystemAlarmPushRecord extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "配置名称（告警名称）",
    length: 255,
  })
  name: string | null;

  @Column("int", {
    name: "push_type",
    nullable: true,
    comment: "推送类型1-钉钉 2-短信",
  })
  pushType: number | null;

  @Column("varchar", {
    name: "push_name",
    nullable: true,
    comment: "推送方式（机器人群，阿里云短信）",
    length: 255,
  })
  pushName: string | null;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "启用状态（0-否 1-是）",
    default: () => "'0'",
  })
  status: number | null;

  @Column("text", {
    name: "alarm_template_system",
    nullable: true,
    comment:
      "告警模板-系统报警\r\n\r\n$1 : 项目名称\r\n$2 : 设备名称\r\n$3 : 参数项\r\n$4 : 点位报警值\r\n$5 : 报警类型\r\n$6 : 文本",
  })
  alarmTemplateSystem: string | null;

  @Column("text", {
    name: "alarm_template_rule",
    nullable: true,
    comment:
      "告警模板-规则报警\r\n\r\n$1 : 项目名称\r\n$2 : 设备名称\r\n$3 : 参数项\r\n$4 : 点位报警值\r\n$5 : 报警类型\r\n$6 : 文本\r\n$7 : 任务名称",
  })
  alarmTemplateRule: string | null;

  @Column("text", {
    name: "receiver_list_json",
    nullable: true,
    comment: "指定的接受人（集合的json字符串）",
  })
  receiverListJson: string | null;

  @Column("text", {
    name: "push_config",
    nullable: true,
    comment:
      "推送的配置文件（以json的方式存储，\r\n如果为钉钉则：webhook；\r\n如果为短信则：\r\nAccessKey,AccessKey Secret，签名（sign）,模板CODE \r\n 加签(jiaqian)",
  })
  pushConfig: string | null;


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
    length: 266,
    select: false
  })
  updateBy: string | null;

  @Column("int", {
    name: "is_appoint",
    nullable: true,
    comment: "是否 @ 接受人 当类型为钉钉的时候存储 0 否 1 是",
    default: () => "'0'",
  })
  isAppoint: number | null;
}
