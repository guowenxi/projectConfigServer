import { Any, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { success, error, pagination, pageType } from '@/util/response'

import { Attributedictionary } from '@modules/entitie/Attributedictionary';
import { Attributedictionaryitems } from '@modules/entitie/Attributedictionaryitems';
import { EquipConfigure } from '@modules/entitie/EquipConfigure';
import { Devicegroup } from '@modules/entitie/Devicegroup';
import { Devicegroupitems } from '@modules/entitie/Devicegroupitems';
import { ConfigureProperty } from '@modules/entitie/ConfigureProperty';
import { ConfigurePointConfigure } from '@modules/entitie/ConfigurePointConfigure';
import { PointPosition } from '@modules/entitie/PointPosition';
import { ModuleInfo } from '@modules/entitie/ModuleInfo';
import { ConfigurePointBind } from '@modules/entitie/ConfigurePointBind';

import { savePointType, type1 } from './equip-configure.controller';
import { DevicegroupitemsDto } from './dto/Devicegroupitems.dto';
import { EquipConfigureDto } from './dto/EquipConfigure.dto';
import { pointConfigListDto } from './dto/pointConfig.dto';

const moment = require('moment');
class pointConfigClass {
  name: string
  stateName: string
  deviceGroupId: string
  type: number
  id: number // devicegroupitemId
  dataSource: string | null
}

@Injectable()
export class EquipConfigureService {
  constructor(
    @InjectRepository(Attributedictionary)
    private AttributedictionaryRepository: Repository<Attributedictionary>,

    //设备组 父表 
    @InjectRepository(Devicegroup)
    private DevicegroupRepository: Repository<Devicegroup>,

    //设备组 子表 
    @InjectRepository(Devicegroupitems)
    private DevicegroupitemsRepository: Repository<Devicegroupitems>,

    // 动态参数表
    @InjectRepository(ConfigureProperty)
    private ConfigurePropertyRepository: Repository<ConfigureProperty>,

    // 点位配置表 -- 跟设备组表有关联
    @InjectRepository(ConfigurePointConfigure)
    private ConfigurePointConfigureRepository: Repository<ConfigurePointConfigure>,

    // 点位绑定表
    @InjectRepository(ConfigurePointBind)
    private ConfigurePointBindRepository: Repository<ConfigurePointBind>,

    // 点位表
    @InjectRepository(PointPosition)
    private PointPositionRepository: Repository<PointPosition>,

    // 模块表 
    @InjectRepository(ModuleInfo)
    private ModuleInfoRepository: Repository<ModuleInfo>,

    // 设备配置表
    @InjectRepository(EquipConfigure)
    private EquipConfigureRepository: Repository<EquipConfigure>,

  ) { }

  async getDeviceGroupList() {
    let error1 = error
    try {
      const data = await this.DevicegroupRepository.createQueryBuilder('Devicegroup')
        .select(`
        Devicegroup.deviceGroupId as id,
        Devicegroup.name as name
      `)
        .where('Devicegroup.isDelete != 1')
        .getRawMany()
      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  //查询参数配置表中的参数 及其下拉列表
  async getAttributedictionaryList() {
    let error1 = error
    try {
      let data = await this.AttributedictionaryRepository.createQueryBuilder('Attributedictionary')
        .leftJoinAndMapMany('Attributedictionary.attriList',
          Attributedictionaryitems,
          'Attributedictionaryitems',
          'Attributedictionary.attributeId = Attributedictionaryitems.attributeId AND Attributedictionaryitems.isDelete != 1')
        .where("Attributedictionary.applyType LIKE :param AND Attributedictionary.isDelete != 1")
        .setParameters({
          param: '%' + '1' + '%'
        })
        .getMany()
      // getmanyandCount()
      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 查询点位配置的信息 -- 根据设备组id来查询
  async getPointConfigureList({
    deviceGroupId,
    equipId
  }) {
    let error1 = error
    try {
      // 分别查询 再map处理一下
      let data1 = await this.DevicegroupitemsRepository.createQueryBuilder('Devicegroupitems')
        .where('enable = 1 AND Devicegroupitems.deviceGroupId = :deviceGroupId AND Devicegroupitems.isDelete != 1', { deviceGroupId })
        .getMany()

      let data2 = await this.ConfigurePointConfigureRepository.createQueryBuilder('ConfigurePointConfigure')
        .where('ConfigurePointConfigure.bindConfigId  = :equipId AND ConfigurePointConfigure.deviceGroupId = :deviceGroupId AND ConfigurePointConfigure.isDelete != 1',
          { equipId, deviceGroupId })
        .getMany()

      let newArry = []

      data1.map((res1, idx1) => {
        let obj: Array<ConfigurePointConfigure> = data2.filter((res2) => {
          return res2.deviceGroupitemId == res1.id
        })
        let pointConfigClass = {
          name: res1.name,
          stateName: res1.stateName,
          deviceGroupId: res1.deviceGroupId,
          type: res1.type,
          id: res1.id,
          dataSource: null
        }
        if (obj.length != 0) {
          pointConfigClass.dataSource = obj[0].dataSource
          newArry.push(pointConfigClass)
        } else {
          newArry.push(pointConfigClass)
        }
      })
      return success('', newArry)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  //表单查询
  async getList({
    key,
    deviceGroupId,
    pageSize,
    pageNo
  }) {
    let error1 = error
    try {

      let total = await this.EquipConfigureRepository
        .createQueryBuilder('EquipConfigure')
        .leftJoinAndSelect(Devicegroup, 'Devicegroup', 'Devicegroup.deviceGroupId = EquipConfigure.deviceGroupId AND Devicegroup.isDelete != 1')
        .where('EquipConfigure.isDelete != 1')
        .getCount()

      let data: Array<EquipConfigure | any> = await this.EquipConfigureRepository
        .createQueryBuilder('EquipConfigure')
        .leftJoinAndSelect(Devicegroup, 'Devicegroup', 'Devicegroup.deviceGroupId = EquipConfigure.deviceGroupId AND Devicegroup.isDelete != 1')
        .select(
          `
          Devicegroup.name  as deviceGroupName,
          EquipConfigure.equipId as equipId,
          EquipConfigure.equipNumber as equipNumber,
          EquipConfigure.name as name,
          EquipConfigure.deviceGroupId as deviceGroupId
          `
        )
        .where(() => {
          let basicStr = `EquipConfigure.isDelete != 1`
          if (!!key) {
            basicStr += ` AND EquipConfigure.name LIKE '%${key}%' `
          }

          if (!!deviceGroupId) {
            basicStr += ` AND EquipConfigure.deviceGroupId = :deviceGroupId `
          }
          return basicStr
        }, { deviceGroupId })
        .skip((pageNo - 1) * pageSize)
        .take(pageSize)
        .getRawMany()

      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        data[i].attriList = await this.ConfigurePropertyRepository.createQueryBuilder('ConfigureProperty')
          .leftJoinAndSelect(Attributedictionary, 'Attributedictionary', 'Attributedictionary.attributeId = ConfigureProperty.attributeId AND Attributedictionary.isDelete != 1')
          .leftJoinAndSelect(Attributedictionaryitems, 'Attributedictionaryitems', 'Attributedictionaryitems.id = ConfigureProperty.valueId AND Attributedictionaryitems.isDelete != 1')
          .where('ConfigureProperty.bindConfigId = :equipId AND ConfigureProperty.isDelete != 1', { equipId: element.equipId })
          .select(
            `
            Attributedictionary.attributeId  as attributeId,
            ConfigureProperty.bindConfigId  as bindConfigId,
            ConfigureProperty.id as id,
            Attributedictionary.paramName as name,
            Attributedictionaryitems.name as value,
            ConfigureProperty.valueId as valueId
            `
          )
          .getRawMany()
      }

      let pageObj: pageType = {
        list: data,
        total,
        current: pageNo,
        pageSize
      }
      return pagination(pageObj)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async getDetail(id) {
    let error1 = error
    try {
      let data: EquipConfigure = await this.EquipConfigureRepository
        .createQueryBuilder('EquipConfigure')
        .leftJoinAndMapMany(
          'EquipConfigure.attriList',
          ConfigureProperty,
          'ConfigureProperty',
          'ConfigureProperty.bindConfigId = EquipConfigure.equipId AND ConfigureProperty.isDelete != 1')
        .where('EquipConfigure.equipId = :equipId AND EquipConfigure.isDelete != 1', { equipId: id })
        .getOne()
      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 查询全部点位列表树图
  async getAllPointTreeList(key) {
    let error1 = error
    try {
      let data: any = []
      if (!!key) {
        data = await this.PointPositionRepository.createQueryBuilder('PointPosition')
          .leftJoinAndSelect(ModuleInfo, 'ModuleInfo', 'ModuleInfo.id = PointPosition.moduleId AND ModuleInfo.isDelete != 1')
          .select(
            `
          PointPosition.name as name,
          PointPosition.id as id,
          ModuleInfo.name as modalName
          `
          )
          .where(`PointPosition.name LIKE :key OR ModuleInfo.name LIKE :key AND PointPosition.isDelete != 1`)
          .setParameters({
            key: '%' + key + '%'
          })
          .getRawMany()
      } else {
        data = await this.ModuleInfoRepository.createQueryBuilder('ModuleInfo')
          .leftJoinAndMapMany(
            'ModuleInfo.pointList',
            PointPosition,
            'PointPosition',
            'PointPosition.moduleId = ModuleInfo.id AND PointPosition.isDelete != 1')
          .where('ModuleInfo.isDelete != 1')
          .getMany()
      }
      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 查询设备点位列表 
  async getEquipPointList(equipId: any) {
    let error1 = error
    try {
      let data = await this.ConfigurePointBindRepository
        .createQueryBuilder('ConfigurePointBind')
        .leftJoinAndSelect(PointPosition, 'PointPosition', 'PointPosition.id = ConfigurePointBind.pointId AND PointPosition.isDelete != 1')
        .leftJoinAndSelect(ModuleInfo, 'ModuleInfo', 'ModuleInfo.id = PointPosition.moduleId AND ModuleInfo.isDelete != 1')
        .select(
          `
        PointPosition.name as name,
        PointPosition.id as id,
        ModuleInfo.name as modalName
        `
        )
        .where('ConfigurePointBind.bindConfigureId = :equipId AND ConfigurePointBind.isDelete != 1', { equipId })
        .getRawMany()
      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async addone(obj: EquipConfigureDto) {
    let error1 = error
    try {
      await this.EquipConfigureRepository
        .createQueryBuilder()
        .insert()
        .into(EquipConfigure)
        .values(
          {
            id: null,
            name: obj.name,
            deviceGroupId: obj.deviceGroupId,
            deviceGroupName: obj.deviceGroupName,
            equipId: obj.equipId,
            equipNumber: obj.equipNumber
          }
        ).execute();

      const { configurePropertyList } = obj

      if (!!configurePropertyList && configurePropertyList.length != 0) {
        let newaArry: Array<ConfigureProperty> = []
        for (let i = 0; i < configurePropertyList.length; i++) {
          const element = configurePropertyList[i];
          let newObj: ConfigureProperty | any = {
            id: null,
            name: element.name,
            attributeId: element.attributeId,
            valueId: element.valueId,
            value: element.value,
            bindConfigId: obj.equipId,
          }
          newaArry.push(newObj)
        }

        await this.ConfigurePropertyRepository.createQueryBuilder()
          .insert()
          .into(ConfigureProperty)
          .values(newaArry)
          .execute();
      }
      return success('')
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 更新点位配置中的数据
  async updataPointConfigInfo(obj: pointConfigListDto) {
    let error1 = error

    try {
      const { pointConfigList } = obj
      let newArry = []

      pointConfigList.map((res) => {
        newArry.push({
          id: null,
          bindConfigId: obj.equipId,
          deviceGroupitemId: res.id,
          deviceGroupId: res.deviceGroupId,
          dataSource: res.dataSource
        })
      })

      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.ConfigurePointConfigureRepository
        .createQueryBuilder()
        .update(ConfigurePointConfigure)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("bindConfigId = :equipId", { equipId: obj.equipId })
        .execute();

      // await this.ConfigurePointConfigureRepository
      //   .createQueryBuilder()
      //   .delete()
      //   .where("bindConfigId = :equipId", { equipId: obj.equipId })
      //   .execute();

      await this.ConfigurePointConfigureRepository.createQueryBuilder()
        .insert()
        .into(ConfigurePointConfigure)
        .values(newArry)
        .execute();

      return success('')
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 保存点位列表数据 -- 作为后面数据源使用
  async savePointList(obj: savePointType) {
    let error1 = error
    try {
      const { pointIdList } = obj
      let newArry: Array<any> = []
      pointIdList.map((res) => {
        let newObj = {
          id: null,
          bindConfigureId: obj.equipId,
          pointId: res,
        }
        newArry.push(newObj)
      })

      // 清掉之前所有的点位数据 -- 然后再添加
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.ConfigurePointBindRepository.createQueryBuilder()
        .update(ConfigurePointBind)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("bindConfigureId = :bindConfigId", { bindConfigId: obj.equipId })
        .execute();

      await this.ConfigurePointBindRepository.createQueryBuilder('ConfigurePointBind')
        .insert()
        .into(ConfigurePointBind)
        .values(newArry)
        .execute();

      return success('')
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  async updataDetail(obj: EquipConfigureDto) {
    let error1 = error
    try {
      let { configurePropertyList } = obj

      await this.EquipConfigureRepository.createQueryBuilder('EquipConfigure')
        .update(EquipConfigure)
        .set({
          deviceGroupId: obj.deviceGroupId,
          deviceGroupName: obj.deviceGroupName,
          equipNumber: obj.equipNumber,
          name: obj.name
        })
        .where("equipId = :equipId", { equipId: obj.equipId })
        .execute();

      for (let i = 0; i < configurePropertyList.length; i++) {
        const element: ConfigureProperty = configurePropertyList[i];
        if (!!element.id) {
          await this.ConfigurePropertyRepository.createQueryBuilder('ConfigureProperty')
            .update(ConfigureProperty)
            .set({
              value: element.value,
              valueId: element.valueId
            })
            .where("id = :id", { id: element.id })
            .execute();
        } else {
          let newObj: ConfigureProperty | any = {
            id: null,
            name: element.name,
            attributeId: element.attributeId,
            valueId: element.valueId,
            value: element.value,
            bindConfigId: obj.equipId,
          }
          await this.ConfigurePropertyRepository.createQueryBuilder()
            .insert()
            .into(ConfigureProperty)
            .values(newObj)
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
          let attributeId = obj.ids[i]
          await this.delConfigureProperty(attributeId)
          await this.delPointBind(obj.id)
          await this.delConfigurePointConfigure(obj.id)
          await this.delEquipConfigure(attributeId)
        }
        return success('删除成功')
      } else if (!!obj.id) {
        await this.delConfigureProperty(obj.id)
        await this.delPointBind(obj.id)
        await this.delConfigurePointConfigure(obj.id)
        await this.delEquipConfigure(obj.id)
        return success('删除成功')
      } else {
        return error1('至少选择一个id')
      }
    } catch (error) {

      return error1('系统错误', error)
    }
  }

  // 删除属性配置表内的信息
  async delConfigureProperty(id) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.ConfigurePropertyRepository.createQueryBuilder()
        .update(ConfigureProperty)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("bindConfigId = :bindConfigId", { bindConfigId: id })
        .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  //  删除点位绑定表
  async delPointBind(id) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.ConfigurePointBindRepository.createQueryBuilder()
        .update(ConfigurePointBind)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("bindConfigId = :bindConfigId", { bindConfigId: id })
        .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  //  删除点位配置表 
  async delConfigurePointConfigure(id) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.ConfigurePointConfigureRepository.createQueryBuilder()
        .update(ConfigurePointConfigure)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("bindConfigId = :bindConfigId", { bindConfigId: id })
        .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 删除设备配置表内的信息
  async delEquipConfigure(id) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.EquipConfigureRepository.createQueryBuilder()
        .update(EquipConfigure)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("equipId = :equipId", { equipId: id })
        .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }

}
