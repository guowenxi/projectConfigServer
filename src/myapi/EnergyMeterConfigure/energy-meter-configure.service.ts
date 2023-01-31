import { Repository } from 'typeorm';
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
// import { ElectroConfigure } from '@modules/entitie/ElectroConfigure';
import { savePointType, type1, UpdataChargingMethods } from './energy-meter-configure.controller';
import { pointConfigListDto } from './dto/pointConfig.dto';
import { ElectroMeterConfigure } from '@modules/entitie/ElectroMeterConfigure';
import { ElectroMeterConfigureDto } from './dto/ElectroMeterConfigure.dto';
import { EnergyBilling } from '@modules/entitie/EnergyBilling';
import { WaterMeterConfigure } from '@modules/entitie/WaterMeterConfigure';
import { WaterMeterConfigureDto } from './dto/WaterMeterConfigure.dto';

const moment = require('moment');
@Injectable()
export class EnergyMeterConfigureService {
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

    // 能耗计费父表 
    @InjectRepository(EnergyBilling)
    private EnergyBillingRepository: Repository<EnergyBilling>,

    // 点位表
    @InjectRepository(PointPosition)
    private PointPositionRepository: Repository<PointPosition>,

    // 模块表 
    @InjectRepository(ModuleInfo)
    private ModuleInfoRepository: Repository<ModuleInfo>,

    // 设备配置表 - 电表
    @InjectRepository(ElectroMeterConfigure)
    private ElectroMeterConfigureRepository: Repository<ElectroMeterConfigure>,

    // 设备配置表 - 水表
    @InjectRepository(WaterMeterConfigure)
    private WaterMeterConfigureRepository: Repository<WaterMeterConfigure>,
  ) { }

  //查询设备组的list - 通用 
  async getDeviceGroupList() {
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
      return error('系统错误', error)
    }
  }

  //查询动态属性 - 通用
  async getAttributedictionaryList(
    {
      meterType
    }
  ) {
    let error1 = error
    try {
      let data = await this.AttributedictionaryRepository.createQueryBuilder('Attributedictionary')
        .leftJoinAndMapMany('Attributedictionary.attriList',
          Attributedictionaryitems,
          'Attributedictionaryitems',
          'Attributedictionary.attributeId = Attributedictionaryitems.attributeId AND Attributedictionaryitems.isDelete != 1')
        .where("Attributedictionary.applyType LIKE :param AND Attributedictionary.isDelete != 1")
        .setParameters({
          param: '%' + `${parseInt(meterType) + 1}` + '%'
        })
        .getMany()
      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 能耗计费列表 - 通用
  async energyConsumptionBillTypeList(
    {
      meterType
    }
  ) {
    let error1 = error
    try {
      let data: Array<EnergyBilling> = await this.EnergyBillingRepository.createQueryBuilder('EnergyBilling')
        .select(
          `
        EnergyBilling.energyId as id,
        EnergyBilling.name as name 
        `
        )
        .where('EnergyBilling.type = :meterType AND EnergyBilling.isDelete != 1', { meterType })
        .getRawMany()

      return success('', data)

    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 查询点位配置的信息 -- 根据设备组id来查询 - 通用 -- bug 会有重复的列表
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

    // let error1 = error
    // try {
    //   let data: Array<Devicegroupitems> = await this.DevicegroupitemsRepository.createQueryBuilder('Devicegroupitems')
    //     .leftJoinAndSelect(ConfigurePointConfigure, 'ConfigurePointConfigure', 'ConfigurePointConfigure.deviceGroupId = Devicegroupitems.deviceGroupId')
    //     .select(
    //       `
    //     Devicegroupitems.deviceGroupId  as deviceGroupId,
    //     Devicegroupitems.id as id,
    //     Devicegroupitems.type as type,
    //     Devicegroupitems.name as name,
    //     Devicegroupitems.stateName  as stateName,
    //     ConfigurePointConfigure.dataSource as dataSource
    //     `
    //     )
    //     .where('enable = 1 AND Devicegroupitems.deviceGroupId = :deviceGroupId', { deviceGroupId })
    //     .getRawMany()
    //   return success('', data)
    // } catch (error) {
    //   return error1(error)
    // }

  }

  //表单查询 -- 总 
  async getList({
    meterType,
    key,
    deviceGroupId,
    pageSize,
    pageNo
  }) {
    if (meterType == 1) {
      return await this.electroMeterGetList({
        key,
        deviceGroupId,
        pageSize,
        pageNo
      })
    } else if (meterType == 2) {
      return await this.waterMeterGetList(
        {
          key,
          deviceGroupId,
          pageSize,
          pageNo
        }
      )
    }
  }
  //表单查询 -- 电表
  async electroMeterGetList({
    key,
    deviceGroupId,
    pageSize,
    pageNo
  }) {
    let error1 = error
    try {
      let total = await this.ElectroMeterConfigureRepository
        .createQueryBuilder('ElectroMeterConfigure')
        .leftJoinAndSelect(Devicegroup, 'Devicegroup', 'Devicegroup.deviceGroupId = ElectroMeterConfigure.deviceGroupId AND Devicegroup.isDelete != 1')
        .leftJoinAndSelect(EnergyBilling, 'EnergyBilling', 'EnergyBilling.energyId = ElectroMeterConfigure.chargingMethodsId AND EnergyBilling.isDelete != 1')
        .where('ElectroMeterConfigure.isDelete != 1')
        .getCount()

      let data: Array<ElectroMeterConfigure | any> = await this.ElectroMeterConfigureRepository
        .createQueryBuilder('ElectroMeterConfigure')
        .leftJoinAndSelect(Devicegroup, 'Devicegroup', 'Devicegroup.deviceGroupId = ElectroMeterConfigure.deviceGroupId AND Devicegroup.isDelete != 1')
        .leftJoinAndSelect(EnergyBilling, 'EnergyBilling', 'EnergyBilling.energyId = ElectroMeterConfigure.chargingMethodsId AND EnergyBilling.isDelete != 1')
        .select(
          `
          Devicegroup.name as deviceGroupName,
          Devicegroup.deviceGroupId as deviceGroupId,
          EnergyBilling.name as chargingMethodsValue,
          ElectroMeterConfigure.equipNumber as equipNumber,
          ElectroMeterConfigure.name as name,
          ElectroMeterConfigure.electricitymeterType as electricitymeterType,
          ElectroMeterConfigure.electricitymeterNumber as electricitymeterNumber,
          ElectroMeterConfigure.equipId as equipId
          `
        )
        .where(() => {
          let basicStr = `ElectroMeterConfigure.isDelete != 1`
          if (!!key) {
            basicStr += ` AND ElectroMeterConfigure.name LIKE '%${key}%' `
          }

          if (!!deviceGroupId) {
            basicStr += ` AND ElectroMeterConfigure.deviceGroupId = :deviceGroupId `
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
  //表单查询 -- 水表
  async waterMeterGetList(
    {
      key,
      deviceGroupId,
      pageSize,
      pageNo
    }
  ) {
    let error1 = error
    try {
      let total = await this.WaterMeterConfigureRepository
        .createQueryBuilder('WaterMeterConfigure')
        .leftJoinAndSelect(Devicegroup, 'Devicegroup', 'Devicegroup.deviceGroupId = WaterMeterConfigure.deviceGroupId AND Devicegroup.isDelete != 1')
        .leftJoinAndSelect(EnergyBilling, 'EnergyBilling', 'EnergyBilling.energyId = WaterMeterConfigure.chargingMethodsId AND EnergyBilling.isDelete != 1')
        .where('WaterMeterConfigure.isDelete != 1')
        .getCount()

      let data: Array<WaterMeterConfigure | any> = await this.WaterMeterConfigureRepository
        .createQueryBuilder('WaterMeterConfigure')
        .leftJoinAndSelect(Devicegroup, 'Devicegroup', 'Devicegroup.deviceGroupId = WaterMeterConfigure.deviceGroupId AND Devicegroup.isDelete != 1')
        .leftJoinAndSelect(EnergyBilling, 'EnergyBilling', 'EnergyBilling.energyId = WaterMeterConfigure.chargingMethodsId AND EnergyBilling.isDelete != 1')
        .select(
          `
          Devicegroup.name as deviceGroupName,
          Devicegroup.deviceGroupId as deviceGroupId,
          EnergyBilling.name as chargingMethodsValue,
          WaterMeterConfigure.name as name,
          WaterMeterConfigure.equipId as equipId,
          WaterMeterConfigure.equipNumber as equipNumber
          `
        )
        .where(() => {
          let basicStr = `WaterMeterConfigure.isDelete != 1`
          if (!!key) {
            basicStr += ` AND WaterMeterConfigure.name LIKE '%${key}%' `
          }

          if (!!deviceGroupId) {
            basicStr += ` AND WaterMeterConfigure.deviceGroupId = :deviceGroupId `
          }

          return basicStr

        }, { deviceGroupId })
        .skip((pageNo - 1) * pageSize)
        .take(pageSize)
        .getRawMany()
      // .where('WaterMeterConfigure.isDelete != 1')
      // .getRawMany()

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

  // 查看详情 - 总
  async getDetail({ id, meterType }) {
    if (meterType == 1) {
      return await this.electroMeterGetDetail(id)
    } else if (meterType == 2) {
      return await this.waterMeterGetDetail(id)
    }
  }

  // 查看详情 - 电表
  async electroMeterGetDetail(id) {
    let error1 = error
    try {
      let data: ElectroMeterConfigure = await this.ElectroMeterConfigureRepository
        .createQueryBuilder('ElectroMeterConfigure')
        .leftJoinAndMapMany(
          'ElectroMeterConfigure.attriList',
          ConfigureProperty,
          'ConfigureProperty',
          'ConfigureProperty.bindConfigId = ElectroMeterConfigure.equipId AND ConfigureProperty.isDelete != 1')
        .where('ElectroMeterConfigure.equipId = :equipId AND ElectroMeterConfigure.isDelete != 1', { equipId: id })
        .getOne()
      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 查看详情 - 水表
  async waterMeterGetDetail(id) {
    let error1 = error
    try {
      let data: WaterMeterConfigure = await this.WaterMeterConfigureRepository
        .createQueryBuilder('WaterMeterConfigure')
        .leftJoinAndMapMany(
          'WaterMeterConfigure.attriList',
          ConfigureProperty,
          'ConfigureProperty',
          'ConfigureProperty.bindConfigId = WaterMeterConfigure.equipId AND ConfigureProperty.isDelete != 1')
        .where('WaterMeterConfigure.equipId = :equipId AND WaterMeterConfigure.isDelete != 1', { equipId: id })
        .getOne()
      return success('系统错误', data)
    } catch (error) {
      return error1(error)
    }
  }

  // 查询全部点位列表树图 - 通用
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

  // 查询设备点位列表 - 通用
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

  // 添加内容 - 总
  async addone({
    obj,
    meterType
  }) { // ElectroConfigureDto
    if (meterType == 1) {
      let ElectroMeterConfigureObj: ElectroMeterConfigureDto = obj
      return await this.electroMeterAddone(ElectroMeterConfigureObj)
    } else if (meterType == 2) {
      let WaterMeterConfigureObj: WaterMeterConfigureDto = obj
      return await this.waterMeterAddone(WaterMeterConfigureObj)
    }
  }

  // 添加内容 - 电表
  async electroMeterAddone(obj: ElectroMeterConfigureDto) {
    let error1 = error
    try {
      await this.ElectroMeterConfigureRepository
        .createQueryBuilder()
        .insert()
        .into(ElectroMeterConfigure)
        .values(
          {
            id: null,
            name: obj.name,
            deviceGroupId: obj.deviceGroupId,
            deviceGroupName: obj.deviceGroupName,
            equipId: obj.equipId,
            equipNumber: obj.equipNumber,

            chargingMethodsId: obj.chargingMethodsId,
            chargingMethodsValue: obj.chargingMethodsValue,
            electricitymeterType: obj.electricitymeterType,
            electricitymeterNumber: obj.electricitymeterNumber || null
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

  // 添加内容 - 水表
  async waterMeterAddone(obj: WaterMeterConfigureDto) {
    let error1 = error
    try {
      await this.WaterMeterConfigureRepository
        .createQueryBuilder()
        .insert()
        .into(WaterMeterConfigure)
        .values(
          {
            id: null,
            name: obj.name,

            deviceGroupId: obj.deviceGroupId,
            deviceGroupName: obj.deviceGroupName,
            equipId: obj.equipId,
            equipNumber: obj.equipNumber,

            chargingMethodsId: obj.chargingMethodsId,
            chargingMethodsValue: obj.chargingMethodsValue,
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

  // 更新点位配置中的数据 - 通用
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

  // 保存点位列表数据 - 通用
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

  // 批量修改计费方式 - 总
  async batchUpdataChargingMethods({
    obj,
    meterType
  }) {
    if (meterType == 1) {
      return this.electroMeterBatchUpdataChargingMethods(obj)
    } else if (meterType == 2) {
      return this.waterMeterBatchUpdataChargingMethods(obj)
    }
  }

  // 批量修改计费方式 - 电表
  async electroMeterBatchUpdataChargingMethods(obj: UpdataChargingMethods) {
    let error1 = error
    try {
      let { equipIds, chargingMethodsId, chargingMethodsValue } = obj

      if (equipIds?.length != 0) {

        for (let i = 0; i < equipIds.length; i++) {

          const id = equipIds[i]

          await this.ElectroMeterConfigureRepository.createQueryBuilder()
            .update(ElectroMeterConfigure)
            .set({
              chargingMethodsId,
              chargingMethodsValue
            })
            .where("equipId = :equipId", { equipId: id })
            .execute();
        }
      }

      return success('')
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 批量修改计费方式 - 水表
  async waterMeterBatchUpdataChargingMethods(obj: UpdataChargingMethods) {
    let error1 = error
    try {
      let { equipIds, chargingMethodsId, chargingMethodsValue } = obj

      if (equipIds?.length != 0) {

        for (let i = 0; i < equipIds.length; i++) {

          const id = equipIds[i]

          await this.WaterMeterConfigureRepository.createQueryBuilder()
            .update(WaterMeterConfigure)
            .set({
              chargingMethodsId,
              chargingMethodsValue
            })
            .where("equipId = :equipId", { equipId: id })
            .execute();
        }
      }

      return success('')
    } catch (error) {
      return error1(error)
    }
  }

  // 更新详情 - 总
  async updataDetail(
    {
      obj,
      meterType
    }
  ) { // ElectroConfigureDto
    if (meterType == 1) {
      let ElectroMeterConfigureObj: ElectroMeterConfigureDto = obj
      return await this.electroMeterUpdataDetail(ElectroMeterConfigureObj)
    } else if (meterType == 2) {
      let WaterMeterConfigureObj: WaterMeterConfigureDto = obj
      return await this.waterMeterUpdataDetail(WaterMeterConfigureObj)
    }
  }

  // 更新详情 - 电表
  async electroMeterUpdataDetail(obj: ElectroMeterConfigureDto) {
    let error1 = error
    try {
      let { configurePropertyList } = obj

      await this.ElectroMeterConfigureRepository.createQueryBuilder('ElectroMeterConfigure')
        .update(ElectroMeterConfigure)
        .set({
          deviceGroupId: obj.deviceGroupId,
          deviceGroupName: obj.deviceGroupName,
          equipNumber: obj.equipNumber,
          name: obj.name,

          chargingMethodsId: obj.chargingMethodsId,
          chargingMethodsValue: obj.chargingMethodsValue,
          electricitymeterType: obj.electricitymeterType,
          electricitymeterNumber: obj.electricitymeterNumber || null
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
      return error1(error)
    }
  }

  // 更新详情 - 水表
  async waterMeterUpdataDetail(obj: WaterMeterConfigureDto) {
    let error1 = error
    try {
      let { configurePropertyList } = obj

      await this.WaterMeterConfigureRepository.createQueryBuilder('WaterMeterConfigure')
        .update(WaterMeterConfigure)
        .set({
          deviceGroupId: obj.deviceGroupId,
          deviceGroupName: obj.deviceGroupName,
          equipNumber: obj.equipNumber,
          name: obj.name,

          chargingMethodsId: obj.chargingMethodsId,
          chargingMethodsValue: obj.chargingMethodsValue,
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
      return error1(error)
    }
  }

  // 删除数据 - 总
  async deldata(obj: type1) {
    let error1 = error
    try {
      if (obj.meterType == 1) {
        if (!!obj.ids && obj.ids.length != 0) {
          for (let i = 0; i < obj.ids.length; i++) {
            let attributeId = obj.ids[i]
            await this.delConfigureProperty(attributeId)
            await this.delElectroMeterConfigure(attributeId)
          }
          return success('删除成功')
        } else if (!!obj.id) {
          await this.delConfigureProperty(obj.id)
          await this.delElectroMeterConfigure(obj.id)
          return success('删除成功')
        } else {
          return error1('至少选择一个id')
        }
      } else if (obj.meterType == 2) {
        if (!!obj.ids && obj.ids.length != 0) {
          for (let i = 0; i < obj.ids.length; i++) {
            let attributeId = obj.ids[i]
            await this.delConfigureProperty(attributeId)
            await this.delWaterMeterConfigure(attributeId)
          }
          return success('删除成功')
        } else if (!!obj.id) {
          await this.delConfigureProperty(obj.id)
          await this.delWaterMeterConfigure(obj.id)
          return success('删除成功')
        } else {
          return error1('至少选择一个id')
        }
      }
    } catch (error) {
      return error1(error)
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

  //  删除设备配置表内的信息 - 电表
  async delElectroMeterConfigure(id) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.ElectroMeterConfigureRepository.createQueryBuilder()
        .update(ElectroMeterConfigure)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("equipId = :equipId", { equipId: id })
        .execute();

      // await this.ElectroMeterConfigureRepository
      //   .createQueryBuilder()
      //   .delete()
      //   .where("equipId = :equipId", { equipId: id })
      //   .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  //  删除设备配置表内的信息 - 水表
  async delWaterMeterConfigure(id) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.WaterMeterConfigureRepository.createQueryBuilder()
        .update(WaterMeterConfigure)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("equipId = :equipId", { equipId: id })
        .execute();

    } catch (error) {
      return error1('系统错误', error)
    }
  }

}
