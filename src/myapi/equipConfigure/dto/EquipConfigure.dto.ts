
import { Attributedictionary } from "@modules/entitie/Attributedictionary";
import { ConfigureProperty } from "@modules/entitie/ConfigureProperty"
import { EquipConfigure } from "@modules/entitie/EquipConfigure"
import { IsNotEmpty } from "class-validator";

export class EquipConfigureDto extends EquipConfigure {

  @IsNotEmpty({ message: '关联设备组id为空!' })
  deviceGroupId: string;

  @IsNotEmpty({ message: '设备名称为空!' })
  name: string;

  configurePropertyList: Array<ConfigureProperty>

}