import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apiary } from './apiary.entity';
import { createApiaryDto } from './dto/create-apiary.dto';
import { UsersService } from 'src/users/users.service';
import { Settings } from './settings.entity';
import { updateApiaryDto } from './dto/update-apiary.dto';
import { updateSettingsDto } from './dto/update-settings.dto';
import { createSettingsDto } from './dto/create-settings.dto';
import { History } from './history.entity';

@Injectable()
export class ApiarysService {
  constructor(
    @InjectRepository(Apiary) private apiaryRepository: Repository<Apiary>,
    @InjectRepository(History) private historyRepository: Repository<History>,
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
    private usersService: UsersService,
  ) {}

  getAll(): Promise<Apiary[]> {
    return this.apiaryRepository.find({
      relations: ['owner', 'settings'],
    });
  }

  async getAllByUserId(id: number) {
    const foundUser = await this.usersService.getUser(id);

    if (!foundUser) {
      return undefined;
    }

    const response = await this.apiaryRepository.find({
      where: { userId: foundUser.id },
      relations: ['settings'],
    });
    return response;
  }

  async getApiary(id: number) {
    const apiaryFound = await this.apiaryRepository.findOne({
      where: { id },
      relations: ['settings'],
    });

    if (!apiaryFound) {
      return undefined;
    }

    return apiaryFound;
  }

  async createApiary(userId: number, apiaryDto: createApiaryDto) {
    const foundUser = await this.usersService.getUser(userId);

    if (!foundUser) {
      return undefined;
    }

    apiaryDto['userId'] = userId;
    const { settings, ...Apiary } = apiaryDto;


    
    const newApiary = this.apiaryRepository.create(Apiary);

    const newApiarySaved = await this.apiaryRepository.save(newApiary);

    settings['apiaryId'] = newApiarySaved.id;
    settings['apiaryUserId'] = userId;

    return this.createSettings(newApiarySaved.id, apiaryDto.settings);
  }

  async deleteApiary(id: number, userId:number) {
    const apiaryFound = await this.apiaryRepository.findOne({ where: {id, userId} });

    if (!apiaryFound) {
      return undefined;
    }

    const response = await this.apiaryRepository.delete({id, userId});
    console.log(response)

    return response
  }

  async updateApiary(id: number, apiary: updateApiaryDto) {
    const apiaryFound = await this.apiaryRepository.findOne({ where: { id } });

    if (!apiaryFound) {
      return undefined;
    }
    return this.apiaryRepository.update(
      { id },
      {
        ...apiaryFound, // existing fields
        ...apiary, // updated fields
      },
    );
  }

  async createSettings(apiaryId: number, settings: createSettingsDto) {
    const apiaryFound = await this.apiaryRepository.findOne({
      where: { id: apiaryId },
    });

    if (!apiaryFound) {
      return undefined;
    }

    const newSettings = this.settingsRepository.create(settings);
    const savedSettings = await this.settingsRepository.save(newSettings);

    apiaryFound.settings = savedSettings;

    return this.apiaryRepository.save(apiaryFound);
  }

  async getSettings(id: number): Promise<Settings> {
    const settingsFound = await this.settingsRepository.findOne({
      where: { id }
    });

    if (!settingsFound) {
      return undefined;
    }

    return settingsFound;
  }


  async updateSettings(id:number, settings: updateSettingsDto) {
    const settingsFound = await this.settingsRepository.findOne({ where: { id:id } });

    if (!settingsFound) {
      return undefined;
    }
    const updatedSettings = await this.settingsRepository.update({ id }, settings);
    return updatedSettings
  }

  async deleteSettings(id: number) {
    const settingsFound = await this.settingsRepository.findOne({
      where: { id },
    });

    if (!settingsFound) {
      return null;
    }

    return this.settingsRepository.delete(id);
  }

  async getHistory(apiaryId: number) {
    const response = await this.historyRepository.find({
      where: { apiaryId },
    });
    return response;
  }
}
