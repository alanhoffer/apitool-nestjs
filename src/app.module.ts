import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { ApiarysController } from './apiarys/apiarys.controller';
import { ApiarysService } from './apiarys/apiarys.service';
import { ApiarysModule } from './apiarys/apiarys.module';
import { Apiary } from './apiarys/apiary.entity';
import { Settings } from './apiarys/settings.entity';
import { History } from './apiarys/history.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '15441109',
      database: 'apitool_test',
      entities: [User, Apiary, Settings, History],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ApiarysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
