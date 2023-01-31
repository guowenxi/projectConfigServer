import { EnergyBilling } from "@modules/entitie/EnergyBilling";
import { IsNotEmpty } from "class-validator";
import { EnergyBillingItemsDto } from "./EnergyBillingItems.dto";

export class EnergyBillingDto extends EnergyBilling {

  @IsNotEmpty({ message: '计费方式名称为空!' })
  name: string

  @IsNotEmpty({ message: '能耗表类型为空!' })
  type: number

  EnergyBillingItems: Array<EnergyBillingItemsDto>

  removeList: Array<EnergyBillingItemsDto>
}