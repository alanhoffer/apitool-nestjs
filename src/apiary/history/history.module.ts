// history.module.ts
import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History])],
  providers: [HistoryService],
  exports: [HistoryService], // Asegúrate de exportar el servicio
})
export class HistoryModule {}
