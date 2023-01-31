import { SystemAlarmRelationPushRecord } from "@modules/entitie/SystemAlarmRelationPushRecord"
import { IsNotEmpty } from "class-validator"

export class WarnBerelatedDto {

  // relationPushRecordId: string
  @IsNotEmpty({ message: 'id为空!' })
  id: string

  alarmTemplateSystem: string

  alarmTemplateRule: string

  bindConfig: Array<SystemAlarmRelationPushRecord>

} 