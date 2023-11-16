import { Module } from '@nestjs/common';
import { ApiaryService } from './apiary.service';
import { ApiaryController } from './apiary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/user/user.module';
import { Settings } from './setting/settings.entity';
import { Apiary } from './apiary.entity';
import { History } from './history/history.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    TypeOrmModule.forFeature([Apiary, Settings, History]),
    UsersModule,
  ],
  providers: [ApiaryService],
  controllers: [ApiaryController],
})
export class ApiaryModule {}
