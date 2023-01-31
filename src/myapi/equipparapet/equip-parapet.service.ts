import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { getConnection, Repository } from 'typeorm';

import { success, error, pagination, pageType } from '@/util/response'

import { EquipparapetDto } from './dto/equipparapet.dto';
import { EquipparapetList } from './dto/equipparapetList.dto'

import { Attributedictionaryitems } from '@modules/entitie/Attributedictionaryitems';
import { ConfigureProperty } from '@modules/entitie/ConfigureProperty';
import { Attributedictionary } from '@modules/entitie/Attributedictionary';
import { Applytypes } from '@modules/entitie/Applytypes';

const moment = require('moment');
@Injectable()
export class EquipParapetService {
  constructor(
    @InjectRepository(Attributedictionary)
    private AttributedictionaryRepository: Repository<Attributedictionary>,

    @InjectRepository(Attributedictionaryitems)
    private AttributedictionaryitemsRepository: Repository<Attributedictionaryitems>,

    @InjectRepository(ConfigureProperty)
    private ConfigurePropertyRepository: Repository<ConfigureProperty>,

    @InjectRepository(Applytypes)
    private ApplytypesRepository: Repository<Applytypes>,
  ) { }

  // 获取表格列表
  async getList({
    key,
    pageSize,
    pageNo
  }) {
    let error1 = error
    try {
      // let list;
      const [list, total] = await this.AttributedictionaryRepository.createQueryBuilder('Attributedictionary')
        .where(() => {
          let basicStr = `Attributedictionary.isDelete != 1`
          if (!!key) {
            basicStr += ` AND Attributedictionary.paramName LIKE '%${key}%' `
          }
          return basicStr
        })
        .setParameters({
          key: '%' + key + '%'
        })
        .skip((pageNo - 1) * pageSize)
        .take(pageSize)
        .orderBy("Attributedictionary.id", "DESC")
        .getManyAndCount()

      let obj: pageType = {
        list: list,
        total,
        current: parseInt(pageNo),
        pageSize: parseInt(pageSize)
      }
      return pagination({ ...obj })
      // return success('', end)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  //获取应用列表 -- 字典表
  async getApplyTypeList() {
    let error1 = error
    try {
      let data = await this.ApplytypesRepository.createQueryBuilder('Applytypes')
        .where('type = :type AND Applytypes.isDelete != 1', { type: 1 })
        .select(
          `
          Applytypes.name as name,
          Applytypes.typeId as id
          `
        ).getRawMany()
      return success('', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  //添加数据
  async addone(Equipparapet: EquipparapetDto) {
    let error1 = error
    try {
      await this.AttributedictionaryRepository.createQueryBuilder().insert().into(Attributedictionary).values({
        id: null,
        attributeId: Equipparapet.attributeId,
        paramName: Equipparapet.paramName,
        applyType: Equipparapet.applyType,
        // createTime:
      }).execute();

      let arry: Array<any> = Equipparapet.equipparapetList;

      if (!!arry && arry.length != 0) {
        for (let i = 0; i < arry.length; i++) {
          arry[i] = {
            id: null,
            attributeId: Equipparapet.attributeId,
            name: arry[i].name
          }
        }
        await this.AttributedictionaryitemsRepository.createQueryBuilder().insert().into(Attributedictionaryitems).values([...arry]).execute();
      }

      return success('添加成功')
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 查看详情
  async getDetail(id) {
    let error1 = error
    try {
      let data = await this.AttributedictionaryRepository.createQueryBuilder('Attributedictionary')
        .leftJoinAndMapMany(
          'Attributedictionary.equipparapetList',
          Attributedictionaryitems,
          'Attributedictionaryitems',
          'Attributedictionary.attribute_id = Attributedictionaryitems.attribute_id AND Attributedictionaryitems.isDelete != 1',
        )
        .where("Attributedictionary.id = :id AND Attributedictionary.isDelete != 1", { id })
        .getOne();
      return success('查询成功', data)
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 更新数据
  async updateDeta(obj: EquipparapetDto) {
    let error1 = error
    try {
      // 修改属性的数据
      await getConnection()
        .createQueryBuilder()
        .update(Attributedictionary)
        .set({ paramName: obj.paramName, applyType: obj.applyType })
        .where("id = :id", { id: obj.id })
        .execute();

      let equipparapetList = obj.equipparapetList || null

      if (equipparapetList == null) {
        return
      }

      // 修改和添加数据
      for (let i = 0; i < equipparapetList.length; i++) {
        const res: any = equipparapetList[i];
        if (!!res.id) {
          await getConnection()
            .createQueryBuilder()
            .update(Attributedictionaryitems)
            .set({ name: res.name })
            .where("id = :id", { id: res.id })
            .execute();
        } else {
          await this.AttributedictionaryRepository.createQueryBuilder().insert().into(Attributedictionaryitems).values({
            id: null,
            name: res.name,
            attributeId: obj.attributeId
          }).execute();
        }
      }

      // 移除数据
      if (!!obj.removeList) {
        let data1 = moment().format("YYYY-MM-DD HH:mm:ss")

        for (let i = 0; i < obj.removeList.length; i++) {

          let res = obj.removeList[i]

          // await getConnection()
          //   .createQueryBuilder()
          //   .delete()
          //   .from(Attributedictionaryitems)
          //   .where("id = :id", { id: res.id })
          //   .execute();

          let len = await this.ConfigurePropertyRepository.createQueryBuilder('ConfigureProperty')
            .where('ConfigureProperty.valueId = :id AND ConfigureProperty.isDelete != 1', {
              id: res.id
            }).getMany()

          if (len?.length != 0) {
            return error1('删除失败,请移除数据间的关联')
          }

          await this.AttributedictionaryitemsRepository
            .createQueryBuilder()
            .update(Attributedictionaryitems)
            .set({ isDelete: 1, deletedTime: data1 })
            .where("id = :id", { id: res.id })
            .execute();
        }
      }

      return success('成功')
    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 删除数据
  async delDeta(obj) {
    let error1 = error
    try {
      if (!!obj.ids && obj.ids.length != 0) {
        for (let i = 0; i < obj.ids.length; i++) {
          let attributeId = obj.ids[i]

          let len = await this.ConfigurePropertyRepository.createQueryBuilder('ConfigureProperty')
            .where('ConfigureProperty.attributeId = :id AND ConfigureProperty.isDelete != 1', {
              id: attributeId
            }).getMany()

          if (len?.length != 0) {
            return error1('删除失败,请移除数据间的关联')
          }

          await this.delDate2(attributeId)
          await this.delDate1(attributeId)
        }
        return success('删除成功')
      } else if (!!obj.id) {

        let len = await this.ConfigurePropertyRepository.createQueryBuilder('ConfigureProperty')
          .where('ConfigureProperty.attributeId = :id AND ConfigureProperty.isDelete != 1', {
            id: obj.id
          }).getMany()

        if (len?.length != 0) {
          return error1('删除失败,请移除数据间的关联')
        }

        await this.delDate2(obj.id)
        await this.delDate1(obj.id)
        return success('删除成功')

      } else {
        return error('请至少选择一个id来删除')
      }

    } catch (error) {
      return error1('系统错误', error)
    }
  }

  // 删除数据 -- 子项
  async delDate1(id) {
    let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
    await this.AttributedictionaryRepository.createQueryBuilder()
      .update(Attributedictionary)
      .set({ isDelete: 1, deletedTime: data1 })
      .where("attributeId = :id", { id })
      .execute();
  }

  // 删除数据 -- 属性内容
  async delDate2(id) {
    let data1 = moment().format("YYYY-MM-DD HH:mm:ss")
    await this.AttributedictionaryitemsRepository
      .createQueryBuilder()
      .update(Attributedictionaryitems)
      .set({ isDelete: 1, deletedTime: data1 })
      .where("attributeId = :id", { id })
      .execute();
  }
}


