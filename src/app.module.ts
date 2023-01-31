import { Injectable, Module, OnModuleInit } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { GraphQLController } from './GraphQL/module';
// import { FileController } from './File/module';
import { mysql } from './mysql';
import { ConfigModule, ConfigService } from '@nestjs/config'; //用于获取node全局环境变量的配置
import config from '@/config/config';
import { AuthGuard } from '@/auth.guard';
import { LoggingInterceptor } from './logging.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
import { TransformInterceptor } from '@transform.interceptor';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EquipParapet } from '@/myapi/equipparapet/equip-parapet.module';
import { DeviceGroupModule } from '@/myapi/devicegroup/device-group.module';
import { EnergyConsumerBillModule } from '@/myapi/energyConsumerBill/energy-consumer-bill.module';
import { EquipConfigureModule } from '@myapi/equipConfigure/equip-configure.module';
import { EnergyMeterConfigureModule } from '@myapi/EnergyMeterConfigure/energy-meter-configure.module';
import { SystemAlarmModule } from '@myapi/systemAlarm/system-alarm.module';
import { SystemAlarmPushModule } from '@myapi/systemAlarmPush/system-alarm-push.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [config],
    }),//全局配置
    // GraphQLModule.forRoot({
    //   debug: true,
    //   playground: false,
    // }),
    mysql, //注入mysql

    // TypeOrmModule.forRoot({
    //   name: 'albumsConnection',
    //   type: 'mysql',
    //   host: '192.168.1.147',
    //   port: 3306,
    //   username: 'test',
    //   password: 'Jiayi123',
    //   database: 'jy_base',
    //   autoLoadEntities: false, //是否将自动加载实体
    //   keepConnectionAlive: true, //在应用程序关闭后连接不会关闭
    //   synchronize: true,
    // }),

    // TypeOrmModule.forRoot({
    //   name: 'albumsConnection',
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'root',
    //   database: 'mynest',
    //   autoLoadEntities: false, //是否将自动加载实体
    //   keepConnectionAlive: true, //在应用程序关闭后连接不会关闭
    //   synchronize: true,
    // }),

    ScheduleModule.forRoot(), //开启计划任务模块

    //可注入其他contrl
    GraphQLController,
    // FileController,
    // TypeOrmModule.forFeature([Applytypes]),

    EquipParapet,
    DeviceGroupModule,
    EnergyConsumerBillModule,
    EquipConfigureModule,
    EnergyMeterConfigureModule,
    SystemAlarmModule,
    SystemAlarmPushModule,
  ],
  //主contrl
  controllers: [
    AppController,
  ],
  providers: [
    // AppService,
    //全局路由守卫
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    //全局拦截器
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
    // //响应拦截器
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformInterceptor,
    // },
  ],
})


export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log(`app启动`);
  }
}
