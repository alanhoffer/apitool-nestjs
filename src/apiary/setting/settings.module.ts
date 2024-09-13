// history.module.ts
import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from './settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  providers: [SettingsService],
  exports: [SettingsService], // Asegúrate de exportar el servicio
})
export class SettingsModule {}
