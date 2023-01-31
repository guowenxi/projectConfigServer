import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { success, error, pagination, pageType } from '@/util/response'


import { EnergyBilling } from '@modules/entitie/EnergyBilling';
import { EnergyBillingItems } from '@modules/entitie/EnergyBillingItems';
import { Applytypes } from '@modules/entitie/Applytypes';
import { ElectroMeterConfigure } from '@modules/entitie/ElectroMeterConfigure';
import { WaterMeterConfigure } from '@modules/entitie/WaterMeterConfigure';

import { EnergyBillingDto } from './dto/EnergyBilling.dto';

import { type1 } from './energy-consumer-bill.controller';

const moment = require('moment');

@Injectable()
export class EnergyConsumerBillService {
  constructor(
    @InjectRepository(EnergyBilling)
    private EnergyBillingRepository: Repository<EnergyBilling>,

    @InjectRepository(EnergyBillingItems)
    private EnergyBillingItemsRepository: Repository<EnergyBillingItems>,

    @InjectRepository(ElectroMeterConfigure)
    private ElectroMeterConfigureRepository: Repository<ElectroMeterConfigure>,

    @InjectRepository(WaterMeterConfigure)
    private WaterMeterConfigureRepository: Repository<WaterMeterConfigure>,

    @InjectRepository(Applytypes)
    private ApplytypesRepository: Repository<Applytypes>,

  ) { }

  // 返回能耗表类型
  async getEnergyTypeList() {
    let error1 = error
    try {
      const data = await this.ApplytypesRepository.createQueryBuilder('Applytypes')
        .where("type = :type AND Applytypes.isDelete != 1", { type: 3 })
        .select(
          `
          Applytypes.typeId as id,
          Applytypes.name as name
          `
        )
        .getRawMany()
      return success('', data)

    } catch (error) {
      return error1(error)
    }
  }

  async addone(obj: EnergyBillingDto) {
    let error1 = error
    try {

      if (!!obj.EnergyBillingItems && obj.EnergyBillingItems.length != 0) {
        let newArry = []
        const newEnergyBillingItems = obj.EnergyBillingItems

        for (let i = 0; i < newEnergyBillingItems.length; i++) {
          const res = newEnergyBillingItems[i];

          if (!!!res.startTime || !!!res.endTime || !!!res.rate) {
            return error1('缺少参数')
          }

          const newobj: any = {
            id: null,
            energyId: obj.energyId,
            startTime: res.startTime || null,
            endTime: res.endTime || null,
            timeType: res.timeType || null,
            rate: res.rate || null,
          }

          newArry.push(newobj)
        }

        await this.EnergyBillingItemsRepository
          .createQueryBuilder()
          .insert()
          .into(EnergyBillingItems)
          .values(newArry).execute();
      }

      await this.EnergyBillingRepository
        .createQueryBuilder()
        .insert()
        .into(EnergyBilling)
        .values({
          id: null,
          energyId: obj.energyId,
          name: obj.name,
          type: obj.type,
          rate: obj.rate || null
        }).execute();

      return success('')
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 获取表单列表
  async getList({
    key,
    pageSize,
    pageNo
  }) {
    let error1 = error
    try {
      let total = await this.EnergyBillingRepository
        .createQueryBuilder('EnergyBilling')
        .leftJoinAndSelect(Applytypes, 'Applytypes', 'EnergyBilling.type = Applytypes.typeId AND Applytypes.isDelete != 1')
        .where('EnergyBilling.isDelete != 1')
        .getCount()

      const data = await this.EnergyBillingRepository
        .createQueryBuilder('EnergyBilling')
        .leftJoinAndSelect(Applytypes, 'Applytypes', 'EnergyBilling.type = Applytypes.typeId AND Applytypes.isDelete != 1')
        // .where('Applytypes.type = :type AND EnergyBilling.isDelete != 1', { type: 3 })
        .where(() => {
          let basicStr = `Applytypes.type = 3 AND EnergyBilling.isDelete != 1`
          if (!!key) {
            basicStr += ` AND EnergyBilling.name LIKE '%${key}%' `
          }
          return basicStr
        }, {})
        .select(
          `
          EnergyBilling.name as name,
          EnergyBilling.energyId as energyId,
          Applytypes.name as typeName,
          Applytypes.typeId as type
          `
        )
        .orderBy("EnergyBilling.id", "DESC")
        .getRawMany();

      let obj: pageType = {
        list: data,
        total,
        current: pageNo,
        pageSize
      }

      return pagination(obj)

    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 获取详情
  async getEnergyDetail(energyId: any) {
    let error1 = error
    try {
      let data = []
      const data1: any = await this.EnergyBillingRepository
        .createQueryBuilder('EnergyBilling')
        .leftJoinAndMapMany(
          'EnergyBilling.dataItemList',
          EnergyBillingItems,
          'EnergyBillingItems',
          'EnergyBillingItems.energyId = EnergyBilling.energyId AND EnergyBillingItems.isDelete != 1',
        )
        .where('EnergyBilling.energyId = :energyId AND EnergyBilling.isDelete != 1', { energyId })
        .getOne()

      if (!!data1) {
        const { dataItemList } = data1
        dataItemList.map((res) => {
          res.startTime = moment(res.startTime.getTime()).format('YYYY-MM-DD HH:mm:ss');
          res.endTime = moment(res.endTime.getTime()).format('YYYY-MM-DD HH:mm:ss');
          return res
        })
        data = data1
      }

      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 删除数据
  async deldata(obj: type1) {
    let error1 = error
    try {
      if (!!obj.ids && obj.ids.length != 0) {
        for (let i = 0; i < obj.ids.length; i++) {
          const element = obj.ids[i];
          let len3 = await this.ElectroMeterConfigureRepository.createQueryBuilder('ElectroMeterConfigure')
            .where('ElectroMeterConfigure.chargingMethodsId = :id ', { id: element })
            .getMany()

          let len4 = await this.WaterMeterConfigureRepository.createQueryBuilder('WaterMeterConfigure')
            .where('WaterMeterConfigure.chargingMethodsId = :id ', { id: element })
            .getMany()

          if (len3?.length != 0 || len4?.length != 0) {
            return error1('删除失败,请移除数据间的关联')
          }
          await this.delDateSon(element)
          await this.delDataFather(element)
        }
        return success('')
      } else if (!!obj.id) {

        let len3 = await this.ElectroMeterConfigureRepository.createQueryBuilder('ElectroMeterConfigure')
          .where('ElectroMeterConfigure.chargingMethodsId = :id ', { id: obj.id })
          .getMany()

        let len4 = await this.WaterMeterConfigureRepository.createQueryBuilder('WaterMeterConfigure')
          .where('WaterMeterConfigure.chargingMethodsId = :id ', { id: obj.id })
          .getMany()

        if (len3?.length != 0 || len4?.length != 0) {
          return error1('删除失败,请移除数据间的关联')
        }

        await this.delDateSon(obj.id)
        await this.delDataFather(obj.id)
        return success('')
      } else {
        return error('请至少选择一个id来删除')
      }

    } catch (error) {
      return error1(error)
    }
  }

  // 删除能耗计费主表
  async delDataFather(energyId) {
    let error1 = error
    try {
      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.EnergyBillingRepository.createQueryBuilder()
        .update(EnergyBilling)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("energyId = :id", { id: energyId })
        .execute();

      // await this.EnergyBillingRepository
      //   .createQueryBuilder()
      //   .delete()
      //   .where("energyId = :id", { id: energyId })
      //   .execute();

    } catch (error) {
      return error1(error)
    }
  }

  // 删除能耗计费子表
  async delDateSon(energyId) {
    let error1 = error
    try {

      let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
      await this.EnergyBillingItemsRepository.createQueryBuilder()
        .update(EnergyBillingItems)
        .set({ isDelete: 1, deletedTime: data1 })
        .where("energyId = :id", { id: energyId })
        .execute();

      // await this.EnergyBillingItemsRepository
      //   .createQueryBuilder()
      //   .delete()
      //   .where("energyId = :id", { id: energyId })
      //   .execute();
    } catch (error) {
      return error1(error)
    }
  }

  // 更新数据
  async updataDetail(obj: EnergyBillingDto) {
    let error1 = error
    try {
      const { EnergyBillingItems, removeList } = obj
      await this.EnergyBillingRepository.createQueryBuilder()
        .update(EnergyBilling)
        .set({ name: obj.name, rate: obj.rate })
        .where("energyId = :id", { id: obj.energyId })
        .execute();

      if (!!removeList && removeList.length != 0) {
        let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
        for (let i = 0; i < removeList.length; i++) {
          let res = obj.removeList[i]

          // await this.EnergyBillingItemsRepository
          //   .createQueryBuilder()
          //   .delete()
          //   .where("id = :id", { id: res.id })
          //   .execute();

          await this.EnergyBillingItemsRepository.createQueryBuilder()
            .update()
            .set({ isDelete: 1, deletedTime: data1 })
            .where("id = :id", { id: res })
            .execute();
        }
      }

      for (let i = 0; i < EnergyBillingItems.length; i++) {
        const element = EnergyBillingItems[i];
        if (!!element.id) {
          await this.EnergyBillingItemsRepository
            .createQueryBuilder()
            .update()
            .set({
              startTime: element.startTime,
              endTime: element.endTime,
              rate: element.rate
            })
            .where("id = :id", { id: element.id })
            .execute();
        } else {
          await this.EnergyBillingItemsRepository
            .createQueryBuilder()
            .insert()
            .values({
              id: null,
              energyId: obj.energyId,
              startTime: element.startTime,
              endTime: element.endTime,
              timeType: element.timeType,
              rate: element.rate,
            })
            .execute();
        }
      }

      return success('')
    } catch (error) {
      return error1(error)
    }
  }
}
