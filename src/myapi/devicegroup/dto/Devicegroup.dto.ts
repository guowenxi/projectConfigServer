import { Devicegroup } from "@modules/entitie/Devicegroup";
import { IsNotEmpty } from "class-validator";
import { DevicegroupitemsDto } from "./Devicegroupitems.dto";


export class DevicegroupDto extends Devicegroup {

  @IsNotEmpty({ message: '参数名称为空!' })
  name: string

  @IsNotEmpty({ message: '设备组类型为空!' })
  type: number

  Devicegroupitems: Array<DevicegroupitemsDto>

  removeList: Array<DevicegroupitemsDto>
}