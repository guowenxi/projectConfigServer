import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { success, error, pagination, pageType } from '@/util/response'
import { type1 } from './device-group.controller';

import { DeviceDataitemDictionaries } from '@modules/entitie/DeviceDataitemDictionaries';
import { DevicegroupDto } from './dto/Devicegroup.dto';
import { Devicegroup } from '@modules/entitie/Devicegroup';
import { Devicegroupitems } from '@modules/entitie/Devicegroupitems';
import { EquipConfigure } from '@modules/entitie/EquipConfigure';
import { ConfigurePointConfigure } from '@modules/entitie/ConfigurePointConfigure';
import { PointPosition } from '@modules/entitie/PointPosition';
import { Applytypes } from '@modules/entitie/Applytypes';
import { WaterMeterConfigure } from '@modules/entitie/WaterMeterConfigure';
import { ElectroMeterConfigure } from '@modules/entitie/ElectroMeterConfigure';
import { ModuleInfo } from '@modules/entitie/ModuleInfo';

const moment = require('moment');
@Injectable()
export class DeviceGroupService {

  constructor(
    @InjectRepository(Devicegroup)
    private DevicegroupRepository: Repository<Devicegroup>,

    @InjectRepository(Devicegroupitems)
    private DevicegroupitemsRepository: Repository<Devicegroupitems>,

    @InjectRepository(Applytypes)
    private ApplytypesRepository: Repository<Applytypes>,

    @InjectRepository(DeviceDataitemDictionaries)
    private DeviceDataitemDictionariesRepository: Repository<DeviceDataitemDictionaries>,

    // 设备配置表
    @InjectRepository(EquipConfigure)
    private EquipConfigureRepository: Repository<EquipConfigure>,

    // 电表
    @InjectRepository(ElectroMeterConfigure)
    private ElectroMeterConfigureRepository: Repository<ElectroMeterConfigure>,

    // 水表
    @InjectRepository(WaterMeterConfigure)
    private WaterMeterConfigureRepository: Repository<WaterMeterConfigure>,

    // 设备配置表
    @InjectRepository(ConfigurePointConfigure)
    private ConfigurePointConfigureRepository: Repository<ConfigurePointConfigure>,

    // 点位表
    @InjectRepository(PointPosition)
    private PointPositionConfigureRepository: Repository<PointPosition>,

  ) { }

  // 获取类型列表
  async getTypeList() {
    let error1 = error
    try {
      let data = await this.ApplytypesRepository.createQueryBuilder('Applytypes')
        .where("Applytypes.type = :type AND Applytypes.isDelete != 1", { type: 2 })
        .select(
          'Applytypes.name', 'name'
        )
        .addSelect(
          'Applytypes.typeId', 'id'
        )
        .getRawMany();
      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 设备组 的树 最后包含 设备信息 及 点位信息 -- bug
  async getTreeDeviceGroupList() {
    let error1 = error
    try {

      let deviceGroupList = await this.DevicegroupRepository
        .createQueryBuilder('Devicegroup')
        .select(
          `
          Devicegroup.deviceGroupId  as id,
          Devicegroup.name  as name
          `
        )
        .where('Devicegroup.isDelete != 1')
        .getRawMany()

      for (let i = 0; i < deviceGroupList.length; i++) {
        let deviceGroupId = deviceGroupList[i].id

        let arry1 = await this.EquipConfigureRepository.createQueryBuilder('EquipConfigure')
          .select(`
          EquipConfigure.equipId as id,
          EquipConfigure.name  as name
          `)
          .where('EquipConfigure.deviceGroupId  = :deviceGroupId AND EquipConfigure.isDelete != 1', { deviceGroupId })
          .getRawMany()

        for (let ii = 0; ii < arry1.length; ii++) {
          const equipId = arry1[ii].id;
          let arry2 = await this.ConfigurePointConfigureRepository.createQueryBuilder('ConfigurePointConfigure')
            .leftJoinAndSelect(PointPosition, 'PointPosition', 'PointPosition.id = ConfigurePointConfigure.dataSource AND PointPosition.isDelete != 1')
            .leftJoinAndSelect(Devicegroupitems, 'Devicegroupitems', 'Devicegroupitems.id = ConfigurePointConfigure.deviceGroupitemId AND Devicegroupitems.isDelete != 1')
            .select(
              `
              ConfigurePointConfigure.dataSource  as pointId,
              Devicegroupitems.name as name,
              ConfigurePointConfigure.id as id,
              PointPosition.name as pointName
               `
            )
            .where('ConfigurePointConfigure.bindConfigId  = :equipId AND ConfigurePointConfigure.dataSource IS NOT NULL AND ConfigurePointConfigure.isDelete != 1', { equipId })
            .getRawMany()

          arry1[ii].children = arry2
        }
        deviceGroupList[i].children = arry1
      }
      return success('', deviceGroupList)
    } catch (error) {
      return error1(error)
    }
  }

  // 查询固定项内容
  async getFiexdItems(
    {
      deveiceTypeId
    }
  ) {
    let error1 = error
    let ary1 = []
    let ary2 = []
    let ary3 = []
    try {
      let ary = await this.DeviceDataitemDictionariesRepository.createQueryBuilder('DeviceDataitemDictionaries')
        .where('DeviceDataitemDictionaries.isDelete != 1 AND DeviceDataitemDictionaries.equipTypeId = :deveiceTypeId OR DeviceDataitemDictionaries.equipTypeId = 0', { deveiceTypeId })
        .getMany();

      ary.map((res, idx) => {
        let type = res.type
        if (type == 1) {
          ary1.push(res)
        } else if (type == 2) {
          ary2.push(res)
        } else if (type == 3) {
          ary3.push(res)
        }
      })

      let data = {
        basicList: ary1,
        readList: ary2,
        issuedList: ary3,
      }

      return success('success', data)

    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 添加数据
  async addone(obj: DevicegroupDto) {
    try {
      await this.DevicegroupRepository.createQueryBuilder()
        .insert()
        .into(Devicegroup)
        .values({
          id: null,
          deviceGroupId: obj.deviceGroupId,
          name: obj.name,
          type: obj.type
        }).execute();
      let arry = obj.Devicegroupitems
      for (let i = 0; i < arry.length; i++) {
        const element = arry[i];
        let new1: any = {
          id: null,
          deviceGroupId: obj.deviceGroupId,
          name: element.name,
          stateName: element.stateName,
          type: element.type,
          flexd: element.flexd || 0,
          enable: element.enable || 0
        }
        arry[i] = new1;
      }
      await this.DevicegroupitemsRepository.createQueryBuilder().insert().into(Devicegroupitems).values(arry).execute();
      // await this.DevicegroupitemsRepository.createQueryBuilder().insert().into(Devicegroupitems).values({
      //   id: null,
      //   deviceGroupId: obj.deviceGroupId,
      //   name: element.name,
      //   stateName: element.stateName,
      //   type: element.type,
      //   flexd: element.flexd || 0,
      //   enable: element.enable || 0
      // }).execute();
      return success('')
    } catch (error) {
      return error(error)
    }
  }

  async getList({
    key,
    pageSize = 10,
    pageNo = 1
  }) {
    let error1 = error
    try {
      let total = await this.DevicegroupRepository
        .createQueryBuilder('Devicegroup')
        .leftJoinAndSelect(Applytypes, 'Applytypes', 'Devicegroup.type = Applytypes.id AND Applytypes.isDelete != 1')
        .where(() => {
          let basicStr = `Devicegroup.isDelete != 1`
          if (!!key) {
            basicStr += ` AND Devicegroup.name LIKE '%${key}%' `
          }
          return basicStr
        })
        .getCount()

      const data: Array<Devicegroup> = await this.DevicegroupRepository
        .createQueryBuilder('Devicegroup')
        .leftJoinAndSelect(Applytypes, 'Applytypes', 'Devicegroup.type = Applytypes.typeId AND Applytypes.type = 2 AND Applytypes.isDelete != 1')
        .where(() => {
          let basicStr = `Devicegroup.isDelete != 1`
          if (!!key) {
            basicStr += ` AND Devicegroup.name LIKE '%${key}%' `
          }
          return basicStr
        })
        // .select(['Devicegroup.id as id', 'Devicegroup.name as name'])
        .select(
          `
          Devicegroup.id as id,
          Devicegroup.name as name,
          Devicegroup.deviceGroupId as deviceGroupId,
          Devicegroup.type as type,
          Applytypes.name as typeName
          `
        )
        .orderBy("Devicegroup.id", "DESC")
        .skip((pageNo - 1) * pageSize)
        .take(pageSize)
        .getRawMany();

      const end: pageType = {
        list: data,
        total,
        current: pageNo,
        pageSize: pageSize || 10
      }

      return pagination(end)
    } catch (error) {
      return error1(error)
    }
  }

  // 获取详情
  async getDetail(deviceGroupId) {
    let error1 = error
    try {
      const data: Devicegroup = await this.DevicegroupRepository.createQueryBuilder('Devicegroup')
        .leftJoinAndMapMany(
          'Devicegroup.dataItemList',
          Devicegroupitems,
          'Devicegroupitems',
          'Devicegroup.deviceGroupId = Devicegroupitems.deviceGroupId AND Devicegroupitems.isDelete != 1',
        )
        .where("Devicegroup.deviceGroupId = :id AND Devicegroup.isDelete != 1", { id: deviceGroupId })
        .getOne()
      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 更新内容
  async updataData(obj: DevicegroupDto) {
    let error1 = error
    try {
      const { removeList, Devicegroupitems } = obj
      await this.DevicegroupRepository
        .createQueryBuilder()
        .update(Devicegroup)
        .set({ name: obj.name, type: obj.type })
        .where("deviceGroupId = :id", { id: obj.deviceGroupId })
        .execute();

      if (!!removeList && removeList.length != 0) {
        let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
        for (let i = 0; i < removeList.length; i++) {

          let res: Devicegroupitems = obj.removeList[i]

          let len = await this.ConfigurePointConfigureRepository.createQueryBuilder('ConfigurePointConfigure')
            .where('ConfigurePointConfigure.deviceGroupitemId = :id', { id: res.id })
            .getMany()

          if (len?.length != 0) {
            return error1('修改失败,请移除数据间的关联')
          }

          await this.DevicegroupitemsRepository.createQueryBuilder()
            .update()
            .set({ isDelete: 1, deletedTime: data1 })
            .where("id = :id", { id: res.id })
            .execute();
        }
      }

      for (let i = 0; i < Devicegroupitems.length; i++) {
        const element = Devicegroupitems[i];
        if (!!element.id) {
          await this.DevicegroupitemsRepository
            .createQueryBuilder()
            .update()
            .set({
              name: element.name,
              stateName: element.stateName,
              enable: element.enable
            })
            .where("id = :id", { id: element.id })
            .execute();
        } else {
          await this.DevicegroupitemsRepository
            .createQueryBuilder()
            .insert()
            .values({
              id: null,
              deviceGroupId: obj.deviceGroupId,
              name: element.name,
              stateName: element.stateName,
              type: element.type,
              flexd: element.flexd || 0,
              enable: element.enable || 0
            })
            .execute();
        }
      }

      return success('')
    } catch (error) {
      console.log(error)
      return error1('系统错误', error)
    }

  }

  // 删除表格假删
  async deldata(obj: type1) {
    let error1 = error
    try {
      if (!!obj.ids && obj.ids.length > 0) {
        for (let i = 0; i < obj.ids.length; i++) {
          const element = obj.ids[i];

          // 绑定数据源的时候
          let len1 = await this.ConfigurePointConfigureRepository.createQueryBuilder('ConfigurePointConfigure')
            .where('ConfigurePointConfigure.deviceGroupId = :id ', { id: element })
            .getMany()

          let len2 = await this.EquipConfigureRepository.createQueryBuilder('EquipConfigure')
            .where('EquipConfigure.deviceGroupId = :id ', { id: element })
            .getMany()

          let len3 = await this.ElectroMeterConfigureRepository.createQueryBuilder('ElectroMeterConfigure')
            .where('ElectroMeterConfigure.deviceGroupId = :id ', { id: element })
            .getMany()

          let len4 = await this.WaterMeterConfigureRepository.createQueryBuilder('WaterMeterConfigure')
            .where('WaterMeterConfigure.deviceGroupId = :id ', { id: element })
            .getMany()

          if (len1?.length != 0 || len2?.length != 0 || len3?.length != 0 || len4?.length != 0) {
            return error1('删除失败,请移除数据间的关联')
          }

          await this.deldataSon(element)
          await this.deldataFather(element)
        }
        return success('')
      } else if (!!obj.id) {
        // 绑定数据源的时候
        let len1 = await this.ConfigurePointConfigureRepository.createQueryBuilder('ConfigurePointConfigure')
          .where('ConfigurePointConfigure.deviceGroupId = :id ', { id: obj.id })
          .getMany()

        let len2 = await this.EquipConfigureRepository.createQueryBuilder('EquipConfigure')
          .where('EquipConfigure.deviceGroupId = :id ', { id: obj.id })
          .getMany()

        let len3 = await this.ElectroMeterConfigureRepository.createQueryBuilder('ElectroMeterConfigure')
          .where('ElectroMeterConfigure.deviceGroupId = :id ', { id: obj.id })
          .getMany()

        let len4 = await this.WaterMeterConfigureRepository.createQueryBuilder('WaterMeterConfigure')
          .where('WaterMeterConfigure.deviceGroupId = :id ', { id: obj.id })
          .getMany()

        if (len1?.length != 0 || len2?.length != 0 || len3?.length != 0 || len4?.length != 0) {
          return error1('删除失败,请移除数据间的关联')
        }

        await this.deldataSon(obj.id)
        await this.deldataFather(obj.id)
        return success('')
      } else {
        return error('请至少选择一个id来删除')
      }

    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 删除设备主表 
  async deldataFather(deviceGroupId: string) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.DevicegroupRepository.createQueryBuilder()
        .update(Devicegroup)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("deviceGroupId = :id", { id: deviceGroupId })
        .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 删除设备子表
  async deldataSon(deviceGroupId: string) {
    let error1 = error
    try {

      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.DevicegroupitemsRepository.createQueryBuilder()
        .update(Devicegroupitems)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("deviceGroupId = :id", { id: deviceGroupId })
        .execute();
    } catch (error) {
      return error1('系统错误', error)
    }
  }

}
