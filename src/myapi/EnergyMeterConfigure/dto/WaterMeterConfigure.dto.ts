import { ConfigureProperty } from "@modules/entitie/ConfigureProperty";
import { WaterMeterConfigure } from "@modules/entitie/WaterMeterConfigure";
import { IsNotEmpty } from "class-validator";

export class WaterMeterConfigureDto extends WaterMeterConfigure {

  @IsNotEmpty({ message: '关联设备组id为空!' })
  deviceGroupId: string;

  @IsNotEmpty({ message: '设备名称为空!' })
  name: string;

  @IsNotEmpty({ message: '计费方式为空!' })
  chargingMethodsId: string;

  configurePropertyList: Array<ConfigureProperty>
}