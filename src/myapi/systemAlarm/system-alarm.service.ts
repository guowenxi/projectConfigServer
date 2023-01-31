import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';

import { success, error, pagination, pageType } from '@/util/response'

import { SystemAlarm } from '@modules/entitie/SystemAlarm';
import { SystemAlarmRang } from '@modules/entitie/SystemAlarmRang';
import { Devicegroup } from '@modules/entitie/Devicegroup';
import { SystemAlarmBindConfig } from '@modules/entitie/SystemAlarmBindConfig';

import { type1 } from './system-alarm.controller';
import { Devicegroupitems } from '@modules/entitie/Devicegroupitems';
import { ConfigurePointConfigure } from '@modules/entitie/ConfigurePointConfigure';
import { EquipConfigure } from '@modules/entitie/EquipConfigure';
import { SystemAlarmDto } from './dto/SystemAlarm.dto';
import { equipConfigAndSystemAlarmBindConfigView } from '@modules/view/equipConfigAndSystemAlarmBindConfig.view';
import { devicegroup_groupitem_sysytemAlarmView } from '@modules/view/devicegroup_groupitem_sysytemAlarm.view';

const moment = require('moment');

@Injectable()
export class SystemAlarmService {

  constructor(
    @InjectRepository(SystemAlarm)
    private SystemAlarmRepository: Repository<SystemAlarm>,

    @InjectRepository(SystemAlarmBindConfig)
    private SystemAlarmBindConfigRepository: Repository<SystemAlarmBindConfig>,

    @InjectRepository(SystemAlarmRang)
    private SystemAlarmRangRepository: Repository<SystemAlarmRang>,

    // 绑定点位表
    @InjectRepository(ConfigurePointConfigure)
    private ConfigurePointConfigureRepository: Repository<ConfigurePointConfigure>,

    // 设备组对象
    @InjectRepository(Devicegroup)
    private DevicegroupRepository: Repository<Devicegroup>,

    // 设备组子项
    @InjectRepository(Devicegroupitems)
    private DevicegroupitemsRepository: Repository<Devicegroupitems>,

    // 设备关联 报警关联 表
    @InjectRepository(equipConfigAndSystemAlarmBindConfigView)
    private equipConfigAndSystemAlarmBindConfigViewRepository: Repository<equipConfigAndSystemAlarmBindConfigView>,



  ) { }

  // 表单
  async getList({
    pageSize = 10,
    pageNo = 1,
    equipName,
    pointName,
    warnType
  }) {
    let error1 = error
    let key = ''
    try {

      // 有设备名 使用另外一种查询 
      let alarmIdList = null
      alarmIdList = await this.equipConfigAndSystemAlarmBindConfigViewRepository
        .createQueryBuilder("equipConfigAndSystemAlarmBindConfigView")
        .select('equipConfigAndSystemAlarmBindConfigView.alarmId')
        .where(`equipConfigAndSystemAlarmBindConfigView.name LIKE :key`)
        .setParameters({
          key: '%' + equipName + '%'
        })

      // console.log(alarmIdList)
      let [list, total] = await this.SystemAlarmRepository
        .createQueryBuilder('SystemAlarm')
        .leftJoinAndMapMany(
          'SystemAlarm.rangList',
          SystemAlarmRang,
          'SystemAlarmRang',
          'SystemAlarmRang.alarmId = SystemAlarm.alarmId AND SystemAlarmRang.isDelete != 1',
        )
        .leftJoinAndMapMany(
          'SystemAlarm.EquipList',
          equipConfigAndSystemAlarmBindConfigView,
          'equipConfigAndSystemAlarmBindConfigView',
          `equipConfigAndSystemAlarmBindConfigView.alarmId = SystemAlarm.alarmId`
        )
        .leftJoinAndMapOne(
          'SystemAlarm.deviceGroupInfo',
          devicegroup_groupitem_sysytemAlarmView,
          'devicegroup_groupitem_sysytemAlarmView',
          'devicegroup_groupitem_sysytemAlarmView.alarmId = SystemAlarm.alarmId',
        )
        .andWhere('SystemAlarm.isDelete != 1', {})
        .where(() => {
          let basicStr = ''
          if (!!warnType && warnType != 'all') {
            basicStr += `SystemAlarm.alarmType = :warnType`
          }
          if (!!equipName) {
            basicStr = basicStr + 'SystemAlarm.alarmId IN ( ' + alarmIdList.getQuery() + ' )'
          }
          return basicStr
        }, { warnType })
        .setParameters(alarmIdList.getParameters())
        .orderBy("SystemAlarm.id", "DESC")
        .skip((pageNo - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const end: pageType = {
        list,
        total,
        current: pageNo,
        pageSize: pageSize || 10
      }

      return pagination(end)

    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 获取设备组点位列表
  async getDeviceGroupList() {
    let error1 = error
    try {
      let list = await this.DevicegroupRepository
        .createQueryBuilder('Devicegroup')
        .where('Devicegroup.isDelete != 1')
        .getMany()
      return success('', list)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 获取设备组属性列表
  async getDeviceGroupItemsList({
    deviceGroupId
  }) {
    let error1 = error
    try {
      let list = await this.DevicegroupitemsRepository
        .createQueryBuilder('Devicegroupitems')
        .where('Devicegroupitems.isDelete != 1 AND  Devicegroupitems.deviceGroupId = :deviceGroupId', { deviceGroupId })
        .getMany()
      return success('', list)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 获取设备列表
  async getDeviceList({
    deviceGroupId,
    deviceGroupitemId
  }) {
    let error1 = error
    try {
      let list = []
      // 设备表列表
      let list1 = await this.ConfigurePointConfigureRepository
        .createQueryBuilder('ConfigurePointConfigure')
        .innerJoinAndSelect(EquipConfigure, 'EquipConfigure', 'EquipConfigure.equipId = ConfigurePointConfigure.bindConfigId AND EquipConfigure.isDelete != 1')
        .select(
          `
          ConfigurePointConfigure.bindConfigId as bindConfigId,
          EquipConfigure.name as name
          `
        )
        .where('ConfigurePointConfigure.isDelete != 1 AND ConfigurePointConfigure.deviceGroupId = :deviceGroupId AND ConfigurePointConfigure.deviceGroupitemId = :deviceGroupitemId', { deviceGroupId, deviceGroupitemId })
        .getRawMany()

      list = [...list1]

      return success('', list)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async addone(obj: SystemAlarmDto) {
    let error1 = error
    try {
      await this.SystemAlarmRepository
        .createQueryBuilder('SystemAlarm')
        .insert()
        .values({
          id: null,
          alarmId: obj.alarmId,
          name: obj.name,
          deviceGroupId: obj.deviceGroupId,
          deviceGroupitemId: obj.deviceGroupitemId,
          alarmType: obj.alarmType,
          alarmValue: obj.alarmValue || null,
          delayTime: obj.delayTime || 0,
          deadZone: obj.deadZone || 0,
          alarmRangType: obj.alarmRangType || 1
        })
        .execute();

      // 添加绑定的设备id
      if (!!obj.equipIds && obj.equipIds.length != 0) {
        let SystemAlarmBindConfigList: any = [];
        obj.equipIds.map((res) => {
          SystemAlarmBindConfigList.push({
            id: null,
            alarmId: obj.alarmId,
            bindConfigureId: res,
          })
        })
        await this.SystemAlarmBindConfigRepository.createQueryBuilder('SystemAlarmBindConfig')
          .insert()
          .values(SystemAlarmBindConfigList)
          .execute();
      }

      // 添加设备报警子项
      if (!!obj.SystemAlarmRangs && obj.SystemAlarmRangs.length != 0) {
        let SystemAlarmRang: any = []

        obj.SystemAlarmRangs.map((res: SystemAlarmRang) => {
          SystemAlarmRang.push({
            id: null,
            alarmId: obj.alarmId,
            promptText: res.promptText,
            emergeDegreeType: res.emergeDegreeType,
            warnValue: res.warnValue,
            alarmRangType: res.alarmRangType,
            warnType: res.warnType
          })
        })

        await this.SystemAlarmRangRepository.createQueryBuilder('SystemAlarmRang')
          .insert()
          .values(SystemAlarmRang)
          .execute();
      }

      return success('')
    } catch (error) {
      return error1('系统错误', error)
    }

  }

  // 获取详情
  async getDetail(id: any) {
    let error1 = error
    try {

      let list = await this.SystemAlarmRepository
        .createQueryBuilder('SystemAlarm')
        .innerJoinAndMapMany(
          'SystemAlarm.rangList',
          SystemAlarmRang,
          'SystemAlarmRang',
          'SystemAlarmRang.alarmId = SystemAlarm.alarmId AND SystemAlarmRang.isDelete != 1',
        )
        .innerJoinAndMapMany(
          'SystemAlarm.equipList',
          SystemAlarmBindConfig,
          'SystemAlarmBindConfig',
          'SystemAlarmBindConfig.alarmId = SystemAlarm.alarmId AND SystemAlarmBindConfig.isDelete != 1',
        )
        .where('SystemAlarm.alarmId = :alarmId AND SystemAlarm.isDelete != 1', { alarmId: id })
        .getOne()

      return success('', list)

    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async updataData(obj: SystemAlarmDto) {
    let error1 = error
    try {

      const { alarmId, SystemAlarmRangs } = obj

      await this.SystemAlarmRepository.createQueryBuilder('SystemAlarm')
        .update(SystemAlarm)
        .set({
          alarmId: obj.alarmId,
          name: obj.name,
          deviceGroupId: obj.deviceGroupId,
          deviceGroupitemId: obj.deviceGroupitemId,
          alarmType: obj.alarmType,
          alarmValue: obj.alarmValue || null,
          delayTime: obj.delayTime,
          deadZone: obj.deadZone || 0,
          alarmRangType: obj.alarmRangType
        })
        .where("alarmId = :alarmId", { alarmId })
        .execute();


      // 添加绑定的设备id
      if (!!obj.equipIds && obj.equipIds.length != 0) {

        // 全删一遍 再添加
        await this.deleteSystemAlarmEquip(alarmId)

        let SystemAlarmBindConfigList: any = [];
        obj.equipIds.map((res) => {
          SystemAlarmBindConfigList.push({
            id: null,
            alarmId: obj.alarmId,
            bindConfigureId: res,
          })
        })
        await this.SystemAlarmBindConfigRepository.createQueryBuilder('SystemAlarmBindConfig')
          .insert()
          .values(SystemAlarmBindConfigList)
          .execute();
      }

      // 添加设备报警子项
      if (!!obj.SystemAlarmRangs && obj.SystemAlarmRangs.length != 0) {

        // 全删一遍 再添加
        await this.deleteSystemAlarmRang(alarmId)

        let SystemAlarmRang: any = []
        for (let i = 0; i < SystemAlarmRangs.length; i++) {
          const element = SystemAlarmRangs[i];
          SystemAlarmRang.push({
            id: null,
            alarmId: obj.alarmId,
            promptText: element.promptText,
            emergeDegreeType: element.emergeDegreeType,
            warnValue: element.warnValue,
            alarmRangType: element.alarmRangType,
            warnType: element.warnType
          })
        }

        if (SystemAlarmRang.length != 0) {
          await this.SystemAlarmRangRepository.createQueryBuilder('SystemAlarmRang')
            .insert()
            .values(SystemAlarmRang)
            .execute();
        }
      }

      return success('')
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async deldata(obj: type1) {
    let error1 = error
    try {
      if (!!obj.ids && obj.ids.length != 0) {
        for (let i = 0; i < obj.ids.length; i++) {
          let alarmId = obj.ids[i]
          await this.deleteSystemAlarmMain(alarmId)
          await this.deleteSystemAlarmRang(alarmId)
          await this.deleteSystemAlarmEquip(alarmId)
        }
        return success('删除成功')
      } else if (!!obj.id) {
        await this.deleteSystemAlarmMain(obj.id)
        await this.deleteSystemAlarmRang(obj.id)
        await this.deleteSystemAlarmEquip(obj.id)
        return success('删除成功')
      } else {
        return error1('至少选择一个id')
      }
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 删除报警主表
  async deleteSystemAlarmMain(id) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.SystemAlarmRepository.createQueryBuilder()
        .update(SystemAlarm)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("alarmId = :alarmId", { alarmId: id })
        .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 删除 报警范围表
  async deleteSystemAlarmRang(id) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.SystemAlarmRangRepository.createQueryBuilder()
        .update(SystemAlarmRang)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("alarmId = :alarmId", { alarmId: id })
        .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 删除 报警绑定设备表
  async deleteSystemAlarmEquip(id) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.SystemAlarmBindConfigRepository.createQueryBuilder()
        .update(SystemAlarmBindConfig)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("alarmId = :alarmId", { alarmId: id })
        .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }
}
