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


@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '15441109',
      database: 'apitool_test',
      entities: [User, Apiary, Settings, History, News],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ApiaryModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
