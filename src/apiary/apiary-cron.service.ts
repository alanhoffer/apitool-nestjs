import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiaryService } from './apiary.service';

@Injectable()
export class ApiaryCronService {
  private readonly logger = new Logger(ApiaryCronService.name);

  constructor(private readonly apiaryService: ApiaryService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    try {
      // Llama a la reducción de alimentos
      await this.apiaryService.subtractFood();

      // Llama a la reducción de tratamientos
      await this.apiaryService.subtractOneDayTreatment('tFence');
      await this.apiaryService.subtractOneDayTreatment('tAmitraz');
      await this.apiaryService.subtractOneDayTreatment('tFlumetrine');
      await this.apiaryService.subtractOneDayTreatment('tOxalic');

      this.logger.log('Se han actualizado los valores de los apiarios.');
    } catch (error) {
      this.logger.error('Error al actualizar los valores de los apiarios.', error.stack);
    }
  }
}
