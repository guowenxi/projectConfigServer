import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { error, success } from '@util/response';
import { getRandomId } from '@util/utils';
import { SystemAlarmPushRecordDto } from './dto/SystemAlarmPushRecord.dto';
import { WarnBerelatedDto } from './dto/WarnBerelated.dto';

import { SystemAlarmPushService } from './system-alarm-push.service';

export class type1 {
  id: string | null
  ids: Array<string> | null
}

@Controller('/systemAlarmPushManger')
export class SystemAlarmPushController {
  constructor(private readonly SystemAlarmPushService: SystemAlarmPushService) { }

  // 表单查询
  @Get('/getSystemAlarmPushList')
  async getList(@Query('pageSize') pageSize, @Query('pageNo') pageNo, @Query('pushType') pushType: any, @Query('status') status: any, @Query('configName') configName: any) {
    return await this.SystemAlarmPushService.getList({
      pageSize,
      pageNo,
      pushType,
      status,
      configName
    })
  }

  // 人员列表
  @Get('/getPeopleList')
  async getPeopleList() {
    return await this.SystemAlarmPushService.getPeopleList()
  }

  // 获取系统报警列表
  @Get('/getSytemAlarmList')
  async getSytemAlarmList(@Query('key') key) {
    return this.SystemAlarmPushService.getSytemAlarmList({ key })
  }

  // 添加数据
  @Post('/addsystemAlarmPush')
  async addone(@Body() obj: SystemAlarmPushRecordDto) {
    return this.SystemAlarmPushService.addone(obj);
  }

  // 保存 报警关联 
  @Post('/saveWarnBerelated')
  async saveWarnBerelated(@Body() obj: WarnBerelatedDto) {
    return this.SystemAlarmPushService.saveWarnBerelated(obj)
  }
  // 报警关联回显
  @Get('/getWarnBerelated')
  async getWarnBerelated(@Query('id') id) {
    if (!!id) {
      return this.SystemAlarmPushService.getWarnBerelated(id)
    } else {
      return error('id参数未传!')
    }
  }

  // 删除数据
  @Post('/delEquipConfigure')
  async deldata(@Body() obj: type1) {
    return this.SystemAlarmPushService.deldata(obj)
  }

  // 查看详情
  @Get('/getSystemAlarmPushDetail')
  async getDetail(@Query('id') id) {
    if (!!id) {
      return await this.SystemAlarmPushService.getDetail(id)
    } else {
      return error('id参数未传')
    }
  }

  // 修改启停状态
  @Post('/changeInitiateMode')
  async changeInitiateMode(@Body() obj: any) {
    const { id, status } = obj
    if (!!id) {
      if (!!status || status == 0) {
        return await this.SystemAlarmPushService.changeInitiateMode(obj)
      } else {
        return success('修改成功')
      }
    } else {
      return error('id参数未传')
    }
  }

  // 修改详情
  @Post('/editsystemAlarmPus')
  async editsystemAlarmPus(@Body() obj: SystemAlarmPushRecordDto) {
    if (!!obj.id) {
      return this.SystemAlarmPushService.editsystemAlarmPus(obj);
    } else {
      return error('id为空')
    }
  }
}
