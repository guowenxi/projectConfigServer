import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { error } from '@util/response';
import { getRandomId } from '@util/utils';
import { SystemAlarmDto } from './dto/SystemAlarm.dto';
import { SystemAlarmService } from './system-alarm.service';

export class type1 {
  id: string | null

  ids: Array<string> | null
}

@Controller('/systemAlarmManger')
export class SystemAlarmController {

  constructor(private readonly SystemAlarmService: SystemAlarmService) { }

  // 表单查询
  @Get('/getSystemAlarmList')
  async getList(@Query('pageSize') pageSize, @Query('pageNo') pageNo, @Query('equipName') equipName, @Query('pointName') pointName, @Query('warnType') warnType) {
    return await this.SystemAlarmService.getList({
      pageSize,
      pageNo,
      equipName,
      pointName,
      warnType
    })
  }

  // 查询设备组列表
  @Get('/getDeviceGroupList')
  async getDeviceGroupList() {
    return this.SystemAlarmService.getDeviceGroupList();
  }

  // 查询设备组属性列表
  @Get('/getDeviceGroupItemsList')
  async getDeviceGroupItemsList(@Query('deviceGroupId') deviceGroupId) {
    return this.SystemAlarmService.getDeviceGroupItemsList({ deviceGroupId });
  }

  // 获取设备列表
  @Get('/getDeviceList')
  async getDeviceList(@Query('deviceGroupId') deviceGroupId, @Query('deviceGroupitemId') deviceGroupitemId) {
    return this.SystemAlarmService.getDeviceList({
      deviceGroupId,
      deviceGroupitemId
    });
  }

  // 添加数据
  @Post('/addSystemAlarm')
  async addone(@Body() obj: SystemAlarmDto) {//DevicegroupDto
    obj.alarmId = getRandomId();
    return this.SystemAlarmService.addone(obj);
  }

  // 查看详情
  @Get('/getSystemAlarmDetail')
  async getDetail(@Query('id') id) {
    if (!!id) {
      return await this.SystemAlarmService.getDetail(id)
    } else {
      return error('id参数未传')
    }
  }

  // 修改数据
  @Post('/updataData')
  async updataDetail(@Body() obj: SystemAlarmDto) { // DevicegroupDto
    if (!!!obj['alarmId']) {
      return error('alarmId未传')
    }
    return this.SystemAlarmService.updataData(obj);
  }

  // 删除数据
  @Post('/delDeviceGroup')
  async deldata(@Body() obj: type1) {
    return this.SystemAlarmService.deldata(obj);
  }

}
