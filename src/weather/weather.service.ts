import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class WeatherService {
    private apiKey = '3389c5ddfc124bf4a1c00055242909';



    constructor(private readonly httpService: HttpService) { }

    getWeather(lat: number, lon: number) {
        
        const url = `http://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${lat},${lon}&aqi=no`;
        return this.httpService.get(url).pipe(
            map(response => response.data),
        );
    }
}
