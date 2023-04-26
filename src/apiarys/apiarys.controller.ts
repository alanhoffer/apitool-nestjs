import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiarysService } from './apiarys.service';
import { createApiaryDto } from './dto/create-apiary.dto';
import { updateApiaryDto } from './dto/update-apiary.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { updateSettingsDto } from './dto/update-settings.dto';

@Controller('apiarys')
export class ApiarysController {
  constructor(private apiarysService: ApiarysService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getApiarys(@Request() req) {
    const apiaryArrayFound = this.apiarysService.getAllByUserId(req.user.sub);

    if (!apiaryArrayFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return apiaryArrayFound;
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async getAllApiarys() {
    return this.apiarysService.getAll();
  }

  @Get('history/:id')
  async getApiaryHistory(@Param('id', ParseIntPipe) apiaryId: number) {
    const response = await this.apiarysService.getHistory(apiaryId);
    return response
  }

  @UseGuards(AuthGuard)
  @Put('settings/:id')
  async updateApiarySettings(
    @Request() req,
    @Param('id', ParseIntPipe) settingsId: number,
    @Body() updateSettingsDto: updateSettingsDto,
  ) {
    
    if (updateSettingsDto.apiaryUserId != req.user.sub) {
      return new HttpException(
        'This settings is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const foundSettings = await this.apiarysService.getSettings(settingsId);

    if (updateSettingsDto.apiaryId != foundSettings.apiaryId) {
      return new HttpException(
        'This settings is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!foundSettings) {
      return new HttpException('Settings not exists', HttpStatus.NOT_FOUND);
    }

    return this.apiarysService.updateSettings(settingsId, updateSettingsDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getApiary(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const foundApiary = await this.apiarysService.getApiary(id);

    if (!foundApiary) {
      return new HttpException('Apiary not exists', HttpStatus.NOT_FOUND);
    }

    if (foundApiary.user != req.user.sub) {
      return new HttpException(
        'This apiary is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return foundApiary;
  }

  @UseGuards(AuthGuard)
  @Post()
  createApiary(@Request() req, @Body() apiary: createApiaryDto) {
    const apiaryCreated = this.apiarysService.createApiary(
      req.user.sub,
      apiary,
    );

    if (!apiaryCreated) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return apiaryCreated;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteApiary(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const foundApiary = await this.apiarysService.getApiary(id);

    if (!foundApiary) {
      return new HttpException('Apiary not exists', HttpStatus.NOT_FOUND);
    }

    if (foundApiary.userId != req.user.sub) {
      return new HttpException(
        'This apiary is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.apiarysService.deleteApiary(foundApiary.id, foundApiary.userId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateApiary(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() apiary: updateApiaryDto,
  ) {
    const foundApiary = await this.apiarysService.getApiary(id);
    if (!foundApiary) {
      return new HttpException('Apiary not exists', HttpStatus.NOT_FOUND);
    }
    if (foundApiary.userId != req.user.sub) {
      return new HttpException(
        'This apiary is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }  
    const response = await this.apiarysService.updateApiary(id, apiary);
    console.log(response)
    return response
  }
}
