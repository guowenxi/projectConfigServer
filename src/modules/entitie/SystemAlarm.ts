import { BaseEntity } from "@modules/commonModule/baseEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("system_alarm", { schema: "jy_base" })
export class SystemAlarm extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "alarm_id",
    comment: "系统报警表唯一id",
    length: 366,
  })
  alarmId: string;

  @Column("varchar", { name: "name", comment: "报警名称", length: 255 })
  name: string;

  @Column("varchar", {
    name: "device_group_id",
    comment: "设备组id",
    length: 255,
  })
  deviceGroupId: string;

  @Column("int", {
    name: "device_groupitem_id",
    nullable: true,
    comment: "设备组参数的id",
  })
  deviceGroupitemId: number | null;

  @Column("text", {
    name: "bind_configure_id",
    nullable: true,
    comment: "设备id 使用，分隔  多选",
  })
  bindConfigureId: string | null;

  @Column("int", { name: "alarm_type", nullable: true, comment: "报警类型id" })
  alarmType: number | null;

  @Column("varchar", {
    name: "alarm_value",
    nullable: true,
    comment: "报警类型 name",
    length: 255,
  })
  alarmValue: string | null;

  @Column("double", {
    name: "delay_time",
    nullable: true,
    comment: "延迟 （s）",
    precision: 255,
    scale: 2,
  })
  delayTime: number | null;

  @Column("double", {
    name: "dead_zone",
    nullable: true,
    comment: "死区",
    precision: 255,
    scale: 2,
  })
  deadZone: number | null;

  @Column("int", {
    name: "alarm_rang_type",
    nullable: true,
    comment: "报警范围类型 1 开关量  2 模拟量",
  })
  alarmRangType: number | null;
}
