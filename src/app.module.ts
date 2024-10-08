import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { ApiaryModule } from './apiary/apiary.module';
import { Apiary } from './apiary/apiary.entity';
import { Settings } from './apiary/setting/settings.entity';
import { History } from './apiary/history/history.entity';
import { NewsModule } from './news/news.module';
import { News } from './news/entities/news.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherModule } from './weather/weather.module';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '192.168.1.149',
      port: 5432,
      password: '15441109Gordo.',
      username: 'bija',
      entities: [User, Apiary, Settings, History, News],
      database: 'apitool1',
      synchronize: true,
      ssl: false, 
    }),
    AuthModule,
    UsersModule,
    ApiaryModule,
    NewsModule,
    WeatherModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
