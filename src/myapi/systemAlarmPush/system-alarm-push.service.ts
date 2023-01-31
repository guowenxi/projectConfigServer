
import { SystemAlarmPushRecord } from '@modules/entitie/SystemAlarmPushRecord';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemAlarmPushRecordDto } from './dto/SystemAlarmPushRecord.dto';

import { success, error, pagination, pageType } from '@/util/response'
import { UserInfo } from '@modules/entitie/UserInfo';
import { SystemAlarm } from '@modules/entitie/SystemAlarm';
import { WarnBerelatedDto } from './dto/WarnBerelated.dto';
import { SystemAlarmRelationPushRecord } from '@modules/entitie/SystemAlarmRelationPushRecord';
import { type1 } from './system-alarm-push.controller';

const moment = require('moment');
@Injectable()
export class SystemAlarmPushService {

  constructor(
    @InjectRepository(SystemAlarmPushRecord)
    private SystemAlarmPushRecordRepository: Repository<SystemAlarmPushRecord>,

    @InjectRepository(UserInfo)
    private UserInfoRepository: Repository<UserInfo>,

    @InjectRepository(SystemAlarm)
    private SystemAlarmRepository: Repository<SystemAlarm>,

    @InjectRepository(SystemAlarmRelationPushRecord)
    private SystemAlarmRelationPushRecordRepository: Repository<SystemAlarmRelationPushRecord>,
  ) { }

  async getList({
    pageSize,
    pageNo,
    pushType,
    status,
    configName
  }) {
    let error1 = error
    try {
      const [list, total] = await this.SystemAlarmPushRecordRepository
        .createQueryBuilder('systemAlarmPushRecord')
        .where(() => {

          let basicStr = `systemAlarmPushRecord.isDelete != 1`

          if (!!configName) {

            basicStr += ` AND systemAlarmPushRecord.name LIKE '%${configName}%'`
          }

          if (!!pushType) {

            basicStr += ` AND systemAlarmPushRecord.pushType = :pushType`
          }

          if (!!status || status == 0) {

            basicStr += ` AND systemAlarmPushRecord.status = :status`
          }
          return basicStr

        }, { pushType, status })
        .orderBy("systemAlarmPushRecord.id", "DESC")
        .getManyAndCount()

      let obj: pageType = {
        list,
        total,
        current: parseInt(pageNo),
        pageSize: parseInt(pageSize)
      }

      return pagination({ ...obj })

    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async getSytemAlarmList({ key }) {
    let error1 = error
    try {
      let data = await this.SystemAlarmRepository.createQueryBuilder('SystemAlarm')
        .select(`
         SystemAlarm.alarmId as id,
         SystemAlarm.name as name
      `)
        .where(() => {
          let basicStr = 'SystemAlarm.isDelete != 1'

          if (!!key) {
            basicStr = basicStr + ` AND SystemAlarm.name LIKE '%${key}%'`
          }

          return basicStr
        })
        // .where('SystemAlarm.isDelete != 1')
        .getRawMany()
      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async getDetail(id: any) {
    let error1 = error
    try {

      let data = await this.SystemAlarmPushRecordRepository
        .createQueryBuilder('SystemAlarmPushRecord')
        .where('SystemAlarmPushRecord.id = :id AND SystemAlarmPushRecord.isDelete != 1', { id })
        .getOne()

      if (!!data.pushConfig) {
        data.pushConfig = JSON.parse(data.pushConfig)
      }
      if (!!data.receiverListJson) {
        data.receiverListJson = JSON.parse(data.receiverListJson)
      }

      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async getPeopleList() {
    let error1 = error
    try {
      let list = await this.UserInfoRepository.createQueryBuilder('UserInfo')
        .where('UserInfo.isDelete != 1')
        .select(
          `
          UserInfo.id as id,
          UserInfo.username as name
          `
        )
        .getRawMany()

      return success('', list)

    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async addone(obj: SystemAlarmPushRecordDto) {
    let error1 = error
    try {
      if (!!obj.receiverListJson && obj.receiverListJson.length != 0) {
        obj.receiverListJson = JSON.stringify(obj.receiverListJson);
      }

      let newPushConfig = {
        webhook: obj.webhook || null,
        jiaqian: obj.jiaqian || null,
        AccessKeyId: obj.AccessKeyId || null,
        AccessKeySecret: obj.AccessKeySecret || null,
        sign: obj.sign || null,
        CODE: obj.CODE || null
      }

      obj.pushConfig = JSON.stringify(newPushConfig);

      await this.SystemAlarmPushRecordRepository.createQueryBuilder()
        .insert()
        .values({
          ...obj
        })
        .execute();

      return success('')

    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async saveWarnBerelated(obj: WarnBerelatedDto) {
    let error1 = error
    try {
      const { id } = obj
      await this.SystemAlarmPushRecordRepository
        .createQueryBuilder('SystemAlarmPushRecord')
        .update()
        .set({
          alarmTemplateSystem: obj.alarmTemplateSystem,
          alarmTemplateRule: obj.alarmTemplateRule
        })
        .where('id = :id AND isDelete != 1', { id })
        .execute()


      await this.delSystemAlarmRelationPushRecord(id)

      await this.SystemAlarmRelationPushRecordRepository.createQueryBuilder()
        .insert()
        .values(obj.bindConfig)
        .execute();

      return success('')
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async getWarnBerelated(id: any) {

    let data = await this.SystemAlarmPushRecordRepository
      .createQueryBuilder('SystemAlarmPushRecord')
      .leftJoinAndMapMany(
        'SystemAlarmPushRecord.bindConfig',
        SystemAlarmRelationPushRecord,
        'SystemAlarmRelationPushRecord',
        'SystemAlarmRelationPushRecord.isDelete != 1 AND SystemAlarmPushRecord.id = SystemAlarmRelationPushRecord.relationPushRecordId'
      )
      .where('SystemAlarmPushRecord.id = :id', { id })
      .getOne()

    return success('', data)

    // await this.SystemAlarmRelationPushRecordRepository
    //   .createQueryBuilder('SystemAlarmRelationPushRecord')
    //   .where('SystemAlarmRelationPushRecord.relationPushRecordId = :id AND SystemAlarmRelationPushRecord.isDelete != 1', { id })
    //   .getMany()
  }

  async editsystemAlarmPus(obj: SystemAlarmPushRecordDto) {
    let error1 = error
    try {
      const { id } = obj

      if (!!obj.receiverListJson && obj.receiverListJson.length != 0) {
        obj.receiverListJson = JSON.stringify(obj.receiverListJson);
      }

      let newPushConfig = {
        webhook: obj.webhook || null,
        jiaqian: obj.jiaqian || null,
        AccessKeyId: obj.AccessKeyId || null,
        AccessKeySecret: obj.AccessKeySecret || null,
        sign: obj.sign || null,
        CODE: obj.CODE || null
      }

      obj.pushConfig = JSON.stringify(newPushConfig);

      await this.SystemAlarmPushRecordRepository.createQueryBuilder('SystemAlarmPushRecord')
        .update()
        .set({
          name: obj.name,
          pushName: obj.pushName,
          receiverListJson: obj.receiverListJson,
          pushConfig: obj.pushConfig
        })
        .where('id = :id AND isDelete != 1', { id })
        .execute();

      return success('')

    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 修改状态启用状态
  async changeInitiateMode(obj: any) {
    let error1 = error
    try {
      const { id, status } = obj

      await this.SystemAlarmPushRecordRepository
        .createQueryBuilder()
        .update()
        .set({ status })
        .where('id = :id AND isDelete != 1', { id })
        .execute();

      return success('')
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 总删除
  async deldata(obj: type1) {

    let error1 = error

    try {
      if (!!obj.ids && obj.ids.length != 0) {
        for (let i = 0; i < obj.ids.length; i++) {
          let attributeId = obj.ids[i]
          await this.delSystemAlarmPushRecord(attributeId)
          await this.delSystemAlarmRelationPushRecord(attributeId)
        }
        return success('')
      } else if (!!obj.id) {
        await this.delSystemAlarmPushRecord(obj.id)
        await this.delSystemAlarmRelationPushRecord(obj.id)
        return success('')
      } else {
        return error1('至少选择一个id')
      }
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 推送表
  async delSystemAlarmPushRecord(id) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.SystemAlarmPushRecordRepository
        .createQueryBuilder()
        .update()
        .set({ isDelete: 1, deletedTime: data1 })
        .where("id = :id", { id })
        .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async delSystemAlarmRelationPushRecord(id) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.SystemAlarmRelationPushRecordRepository
        .createQueryBuilder()
        .update()
        .set({ isDelete: 1, deletedTime: data1 })
        .where("relationPushRecordId = :id", { id })
        .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }

}
