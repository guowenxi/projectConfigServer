import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { getRandomId } from '@/util/utils'
import { success, error, pagination, pageType } from '@/util/response'
import { EnergyMeterConfigureService } from './energy-meter-configure.service';
import { DevicegroupitemsDto } from './dto/Devicegroupitems.dto';
import { pointConfigListDto } from './dto/pointConfig.dto';
import { IsNotEmpty } from 'class-validator';

// 删除的类型
export class type1 {
  id: string | null
  ids: Array<string> | null
  @IsNotEmpty({ message: '缺少类型参数!' })
  meterType: 1 | 2 | 3 | 4
}

export class UpdataChargingMethods {
  @IsNotEmpty({ message: '缺少类型参数!' })
  meterType: 1 | 2 | 3 | 4

  chargingMethodsId: any

  chargingMethodsValue: any

  @IsNotEmpty({ message: '设备id为空!' })
  equipIds: Array<string>
}

export class savePointType {

  // 设备表的id
  @IsNotEmpty({ message: '设备id为空!' })
  equipId: any

  // 点位id的list
  pointIdList: Array<any>
}

export class meterType {
  meterType: 1 | 2 | 3 | 4 // 1 电表 2 水表
}

@Controller('energyMeterConfigureManger')
export class EnergyMeterConfigureController {

  constructor(private readonly EnergyMeterConfigureService: EnergyMeterConfigureService) { }

  // 表单查询
  @Get('/getEquipConfigureList')
  async getList(@Query('key') key: any, @Query('deviceGroupId') deviceGroupId: any, @Query('pageSize') pageSize, @Query('pageNo') pageNo, @Query('meterType') meterType: meterType) {
    if (!!!meterType) {
      return error('缺少类型参数')
    }
    return this.EnergyMeterConfigureService.getList({
      key,
      deviceGroupId,
      meterType,
      pageSize,
      pageNo
    })
  }

  // 查询设备组类型
  @Get('/getDeviceGroupList')
  async getDeviceGroupList() {
    return this.EnergyMeterConfigureService.getDeviceGroupList()
  }

  //查询点位配置的信息 -- 根据设备组id来查询
  @Get('/getPointConfigureList')
  async getPointConfigureList(
    @Query('deviceGroupId') deviceGroupId: DevicegroupitemsDto,
    @Query('equipId') equipId: any
  ) {

    if (!!!deviceGroupId) {
      return error('deviceGroupId参数未传')
    }
    if (!!!equipId) {
      return error('equipId参数未传')
    }

    return this.EnergyMeterConfigureService.getPointConfigureList({
      deviceGroupId,
      equipId
    })
  }

  //查询参数配置表中的参数 及其下拉列表
  @Get('/getAttributedictionaryList')
  async getAttributedictionaryList(@Query('meterType') meterType: meterType) {

    if (!!!meterType) {
      return error('请输入表格的type类型')
    }

    return this.EnergyMeterConfigureService.getAttributedictionaryList(
      {
        meterType
      }
    )
  }

  // 查询全部点位列表树图
  @Get('/getAllPointTreeList')
  async getAllPointTreeList(@Query('key') key) {
    return this.EnergyMeterConfigureService.getAllPointTreeList(key)
  }

  // 查询设备点位列表 
  @Get('/getEquipPointList')
  async getEquipPointList(@Query('equipId') equipId: any) {
    if (!!!equipId) {
      return error('缺少设备id')
    }
    return this.EnergyMeterConfigureService.getEquipPointList(equipId)
  }

  //能耗计费列表
  @Get('/energyConsumptionBillTypeList')
  async energyConsumptionBillTypeList(@Query('meterType') meterType: meterType) {
    if (!!!meterType) {
      return error('缺少类型参数')
    }
    return this.EnergyMeterConfigureService.energyConsumptionBillTypeList({
      meterType
    })
  }

  // 添加数据
  @Post('/addEquipConfigure')
  async addone(@Body() obj: any) { // ElectroConfigureDto
    obj.equipId = getRandomId();
    return this.EnergyMeterConfigureService.addone({
      obj: obj,
      meterType: obj.meterType
    })
  }

  //保存点位列表数据
  @Post('/savePointList')
  async savePointList(@Body() obj: savePointType) {
    return this.EnergyMeterConfigureService.savePointList(obj)
  }

  // 更新点位配置中的数据
  @Post('/updataPointConfigInfo')
  async updataPointConfigInfo(@Body() obj: pointConfigListDto) {
    return this.EnergyMeterConfigureService.updataPointConfigInfo(obj)
  }

  // 批量修改计费方式
  @Post('/batchUpdataChargingMethods')
  async batchUpdataChargingMethods(@Body() obj: UpdataChargingMethods) {
    return this.EnergyMeterConfigureService.batchUpdataChargingMethods({
      obj: obj,
      meterType: obj.meterType
    })

  }

  // 删除数据
  @Post('/delEquipConfigure')
  async deldata(@Body() obj: type1) {
    return this.EnergyMeterConfigureService.deldata(obj)
  }

  // 查看详情
  @Get('/getequipConfigureDetail')
  async getDetail(@Query('id') id, @Query('meterType') meterType: meterType) {
    if (!!!id) {
      return error('缺少id')
    }

    if (!!!meterType) {
      return error('缺少类型参数')
    }

    return this.EnergyMeterConfigureService.getDetail({
      id,
      meterType
    })
  }

  // 修改数据
  @Post('/updataData')
  async updataDetail(@Body() obj: any) {//ElectroConfigureDto
    return this.EnergyMeterConfigureService.updataDetail({
      obj: obj,
      meterType: obj.meterType
    })
  }

}
