import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { error } from '@util/response';
import { getRandomId } from '@util/utils';

import { DeviceGroupService } from './device-group.service';
import { DevicegroupDto } from './dto/Devicegroup.dto';


export class type1 {
  id: string | null

  ids: Array<string> | null
}
@Controller('/devicegroupManger')
export class DeviceGroupController {
  constructor(private readonly DeviceGroupService: DeviceGroupService) { }

  // 表单查询
  @Get('/getDeviceGroupList')
  async getList(@Query('key') key: any, @Query('pageSize') pageSize, @Query('pageNo') pageNo) {
    return await this.DeviceGroupService.getList({
      key,
      pageSize,
      pageNo
    })
  }

  // 查询设备类型
  @Get('/getEquipTypeList')
  async getTypeList() {
    return await this.DeviceGroupService.getTypeList();
  }

  // 查询固定
  @Get('/getFlexdItemeList')
  async getFlexdItemeList() {
    return await this.DeviceGroupService.getFiexdItems();
  }

  // 添加数据
  @Post('/addDeviceGroup')
  async addone(@Body() obj: DevicegroupDto) {
    obj.deviceGroupId = getRandomId();
    return this.DeviceGroupService.addone(obj);
  }

  // 删除数据
  @Post('/delDeviceGroup')
  async deldata(@Body() obj: type1) {
    return this.DeviceGroupService.deldata(obj);
  }

  // 查看详情
  @Get('/getDeviceGroupDetail')
  async getDetail(@Query('id') id) {
    if (!!id) {
      return await this.DeviceGroupService.getDetail(id)
    } else {
      return error('id参数未传')
    }
  }
  // 修改数据
  @Post('/updataData')
  async updataDetail(@Body() obj: DevicegroupDto) {
    return this.DeviceGroupService.updataData(obj);
  }

  // 设备组 的树 最后包含 设备信息 及点位信息
  @Get('/getTreeDeviceGroupList')
  async getTreeDeviceGroupList() {
    return this.DeviceGroupService.getTreeDeviceGroupList()
  }
}
