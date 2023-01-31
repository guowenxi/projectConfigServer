import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { getRandomId } from '@/util/utils'
import { EquipConfigureService } from './equip-configure.service';
import { EquipConfigureDto } from './dto/EquipConfigure.dto';
import { DevicegroupitemsDto } from './dto/Devicegroupitems.dto';
import { pointConfigDto, pointConfigListDto } from './dto/pointConfig.dto';
import { error } from '@util/response';
import { IsNotEmpty } from 'class-validator';

// 删除的类型
export class type1 {
  id: string | null

  ids: Array<string> | null
}

// 保存点位列表类型

export class savePointType {
  // 点位id的list
  pointIdList: Array<any>

  // 设备表的id
  @IsNotEmpty({ message: '设备id为空!' })
  equipId: any
}

@Controller('equipConfigureManger')
export class EquipConfigureController {
  constructor(private readonly EquipConfigureService: EquipConfigureService) { }

  // 表单查询
  @Get('/getEquipConfigureList')
  async getList(@Query('key') key: any, @Query('deviceGroupId') deviceGroupId: any, @Query('pageSize') pageSize, @Query('pageNo') pageNo) {
    return this.EquipConfigureService.getList({
      key,
      deviceGroupId,
      pageSize,
      pageNo
    })
  }

  // 查询设备组类型
  @Get('/getDeviceGroupList')
  async getDeviceGroupList() {
    return this.EquipConfigureService.getDeviceGroupList()
  }

  // 查询点位配置的信息 -- 根据设备组id来查询
  @Get('/getPointConfigureList')
  async getPointConfigureList(
    @Query('deviceGroupId') deviceGroupId: any,
    @Query('equipId') equipId: any) {
    if (!!!deviceGroupId) {
      return error('deviceGroupId参数未传')
    }
    if (!!!equipId) {
      return error('equipId参数未传')
    }
    return this.EquipConfigureService.getPointConfigureList({
      deviceGroupId,
      equipId
    })
  }

  //查询参数配置表中的参数 及其下拉列表
  @Get('/getAttributedictionaryList')
  async getAttributedictionaryList() {
    return this.EquipConfigureService.getAttributedictionaryList()
  }

  // 查询全部点位列表树图
  @Get('/getAllPointTreeList')
  async getAllPointTreeList(@Query('key') key) {
    return this.EquipConfigureService.getAllPointTreeList(key)
  }

  // 查询设备点位列表 
  @Get('/getEquipPointList')
  async getEquipPointList(@Query('equipId') equipId: any) {
    if (!!equipId) {
      return this.EquipConfigureService.getEquipPointList(equipId)
    } else {
      return error('缺少参数equipId')
    }
  }

  // 添加数据
  @Post('/addEquipConfigure')
  async addone(@Body() obj: EquipConfigureDto) {
    obj.equipId = getRandomId();
    return this.EquipConfigureService.addone(obj)
  }

  // 保存点位列表数据 -- 作为后面数据源使用
  @Post('/savePointList')
  async savePointList(@Body() obj: savePointType) {
    return this.EquipConfigureService.savePointList(obj)
  }

  // 更新点位配置中的数据
  @Post('/updataPointConfigInfo')
  async updataPointConfigInfo(@Body() obj: pointConfigListDto) {
    return this.EquipConfigureService.updataPointConfigInfo(obj)
  }

  // 删除数据
  @Post('/delEquipConfigure')
  async deldata(@Body() obj: type1) {
    return this.EquipConfigureService.deldata(obj)
  }

  // 查看详情
  @Get('/getequipConfigureDetail')
  async getDetail(@Query('id') id) {
    if (!!id) {
      return this.EquipConfigureService.getDetail(id)
    } else {
      return error('缺少id')
    }
  }

  // 修改数据
  @Post('/updataData')
  async updataDetail(@Body() obj: EquipConfigureDto) {
    return this.EquipConfigureService.updataDetail(obj)
  }
}
