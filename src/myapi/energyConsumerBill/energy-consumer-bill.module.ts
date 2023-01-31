import { Applytypes } from '@modules/entitie/Applytypes';
import { ElectroMeterConfigure } from '@modules/entitie/ElectroMeterConfigure';
import { EnergyBilling } from '@modules/entitie/EnergyBilling';
import { EnergyBillingItems } from '@modules/entitie/EnergyBillingItems';
import { WaterMeterConfigure } from '@modules/entitie/WaterMeterConfigure';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnergyConsumerBillController } from './energy-consumer-bill.controller';
import { EnergyConsumerBillService } from './energy-consumer-bill.service';

@Module({
  imports: [TypeOrmModule.forFeature(
    [
      EnergyBilling,
      EnergyBillingItems,
      Applytypes,
      WaterMeterConfigure,
      ElectroMeterConfigure
    ])
  ],
  controllers: [EnergyConsumerBillController],
  providers: [EnergyConsumerBillService]
})
export class EnergyConsumerBillModule { }
