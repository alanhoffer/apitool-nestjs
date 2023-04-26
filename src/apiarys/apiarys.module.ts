import { Module } from '@nestjs/common';
import { ApiarysService } from './apiarys.service';
import { ApiarysController } from './apiarys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Settings } from './settings.entity';
import { Apiary } from './apiary.entity';
import { History } from './history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apiary, Settings, History]), UsersModule],
  providers: [ApiarysService],
  controllers: [ApiarysController],
})
export class ApiarysModule {}
