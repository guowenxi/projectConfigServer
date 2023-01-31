import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { getRandomId } from '@util/utils';

import { EnergyBillingDto } from './dto/EnergyBilling.dto';
import { EnergyConsumerBillService } from './energy-consumer-bill.service';

export class type1 {
  id: string | null

  ids: Array<string> | null
}
@Controller('/energybillManger')
export class EnergyConsumerBillController {
  constructor(private readonly EnergyConsumerBillService: EnergyConsumerBillService) { }

  // 表单查询
  @Get('/getEnergyBillList')
  async getList(@Query('key') key: any, @Query('pageSize') pageSize, @Query('pageNo') pageNo) {
    return this.EnergyConsumerBillService.getList({
      key,
      pageSize,
      pageNo
    });
  }

  // 能耗表类型
  @Get('/getEnergyBillTypeList')
  async getEnergyTypeList() {
    return this.EnergyConsumerBillService.getEnergyTypeList()
  }

  // 添加新数据
  @Post('/addEnergyBill')
  async addone(@Body() obj: EnergyBillingDto) {
    obj.energyId = getRandomId();
    return this.EnergyConsumerBillService.addone(obj)
  }

  // 查看详情
  @Get('/getEnergyBillDetail')
  async getEnergyDetail(@Query('energyId') energyId) {
    return this.EnergyConsumerBillService.getEnergyDetail(energyId)
  }

  // 更新数据
  @Post('/updateEnergyBill')
  async updataDetail(@Body() obj: EnergyBillingDto) {
    return this.EnergyConsumerBillService.updataDetail(obj)
  }
  // 删除数据
  @Post('/delteEnergyBill')
  async deldata(@Body() obj: type1) {
    return this.EnergyConsumerBillService.deldata(obj)
  }

}
