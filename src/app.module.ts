import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { ApiarysModule } from './apiarys/apiarys.module';
import { Apiary } from './apiarys/apiary.entity';
import { Settings } from './apiarys/settings.entity';
import { History } from './apiarys/history.entity';
import { NewsModule } from './news/news.module';
import { News } from './news/entities/news.entity';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [
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
    ApiarysModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
