import { BaseEntity } from "@modules/commonModule/baseEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("system_alarm_bind_config", { schema: "jy_base" })
export class SystemAlarmBindConfig extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "跟系统报警表关联 -- 存储设备的id",
  })
  id: number;

  @Column("varchar", { name: "alarm_id", comment: "关联系统报警表唯一id" })
  alarmId: string;

  @Column("varchar", { name: "bind_configure_id", comment: "设备的id" })
  bindConfigureId: string;
}
