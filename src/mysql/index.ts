import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
export const mysql = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    autoLoadEntities: true,
    synchronize: true,
    ...configService.get<any>('database'),
  }),
});