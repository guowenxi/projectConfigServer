import { Module } from '@nestjs/common';
import { EnergyBillController } from './energy-bill.controller';
import { EnergyBillService } from './energy-bill.service';

@Module({
  controllers: [EnergyBillController],
  providers: [EnergyBillService]
})
export class EnergyBillModule {}
