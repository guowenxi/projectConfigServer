import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { EquipParapetService } from './equip-parapet.service';
import { EquipparapetDto } from './dto/equipparapet.dto';
import { getRandomId } from '@/util/utils'
import { success, error, pagination, pageType } from '@/util/response'
interface type1 {
  id: string
}

interface type2 {
  id: string | null,
  ids: Array<string> | null
}

@Controller('/equipparapet')
export class EquipParapetController {

  constructor(private readonly EquipParapetService: EquipParapetService) { }

  // 获取表单列表
  @Get('/getEquipParapetList')
  async getlist(@Query('key') key, @Query('pageSize') pageSize, @Query('pageNo') pageNo) {

    return await this.EquipParapetService.getList({
      key,
      pageSize,
      pageNo
    });
  }

  //获取应用type list
  @Get('/getApplyTypeList')
  async getApplyTypeList() {
    return this.EquipParapetService.getApplyTypeList()
  }

  // 添加数据
  @Post('/addtEquipParapet')
  async addtEquipParapet(@Body() Equipparapet: EquipparapetDto) {
    // getRandomId
    Equipparapet.attributeId = getRandomId();
    return this.EquipParapetService.addone(Equipparapet)
  }

  // 查询详情
  @Get('getDetailbyid')
  async getDetail(@Query('id') id: type1) {
    if (!!id) {
      return this.EquipParapetService.getDetail(id)
    } else {
      return error('id未传', {})
    }
  }

  // 批量删除
  @Post('delManyItems')
  async delmany(@Body() Obj: type2) {
    return this.EquipParapetService.delDeta(Obj)
  }

  //编辑
  @Post('editEquipparapet')
  async editInfo(@Body() Obj: EquipparapetDto) {
    return this.EquipParapetService.updateDeta(Obj)
  }

}
