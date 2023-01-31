
import { SystemAlarm } from '@modules/entitie/SystemAlarm';
import { SystemAlarmPushRecord } from '@modules/entitie/SystemAlarmPushRecord';
import { SystemAlarmRelationPushRecord } from '@modules/entitie/SystemAlarmRelationPushRecord';
import { UserInfo } from '@modules/entitie/UserInfo';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemAlarmPushController } from './system-alarm-push.controller';
import { SystemAlarmPushService } from './system-alarm-push.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    SystemAlarmPushRecord,
    UserInfo,
    SystemAlarm,
    SystemAlarmRelationPushRecord
  ])],
  controllers: [SystemAlarmPushController],
  providers: [SystemAlarmPushService]
})
export class SystemAlarmPushModule { }
