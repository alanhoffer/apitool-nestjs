import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { HttpModule } from '@nestjs/axios';  // Asegúrate de importar HttpModule


@Module({
  imports: [HttpModule],
  providers: [WeatherService],
  controllers: [WeatherController],
  exports: [WeatherService]
})
export class WeatherModule {

}
