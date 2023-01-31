import { SystemAlarmPushRecord } from "@modules/entitie/SystemAlarmPushRecord";
import { IsNotEmpty } from "class-validator";

export class SystemAlarmPushRecordDto extends SystemAlarmPushRecord {

  // @IsNotEmpty({ message: '参数名称为空!' })
  // name: string

  // @IsNotEmpty({ message: '设备组类型为空!' })
  // type: number

  webhook: string | null

  jiaqian: string | null

  AccessKeyId: String | null

  AccessKeySecret: String | null

  sign: String | null

  CODE: String | null

}