import { ConfigureProperty } from "@modules/entitie/ConfigureProperty";
import { ElectroMeterConfigure } from "@modules/entitie/ElectroMeterConfigure";
import { IsNotEmpty } from "class-validator";

export class ElectroMeterConfigureDto extends ElectroMeterConfigure {

  @IsNotEmpty({ message: '关联设备组id为空!' })
  deviceGroupId: string;

  @IsNotEmpty({ message: '设备名称为空!' })
  name: string;

  @IsNotEmpty({ message: '计费方式为空!' })
  chargingMethodsId: string;

  @IsNotEmpty({ message: '电表类型为空!' })
  electricitymeterType: number;

  configurePropertyList: Array<ConfigureProperty>
}