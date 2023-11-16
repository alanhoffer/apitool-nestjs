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
      type: 'postgres',
      host: 'dpg-clat6j6nt67s73f6ldtg-a.oregon-postgres.render.com',
      port: 5432,
      password: 'Ix4RcblQCCUwOzadN3TGAusd7vs7afIx',
      username: 'apitool_db_postgres_user',
      entities: ["dist/**/**.entity{.ts,.js}"],
      database: 'apitool_db_postgres',
      synchronize: true,
      ssl: true, 
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
