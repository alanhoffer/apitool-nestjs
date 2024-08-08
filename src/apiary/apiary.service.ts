import { Injectable, Logger, ConsoleLogger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Apiary } from './apiary.entity';
import { createApiaryDto } from './dto/create-apiary.dto';
import { Settings } from './setting/settings.entity';
import { updateApiaryDto } from './dto/update-apiary.dto';
import { updateSettingsDto } from './setting/dto/update-settings.dto';
import { createSettingsDto } from './setting/dto/create-settings.dto';
import { History } from './history/history.entity';
import { ApiaryDTO } from './dto/apiary.dto';
import { Cron, CronExpression } from '@nestjs/schedule';



@Injectable()
export class ApiaryService {

  private readonly logger = new Logger(ApiaryService.name)
  historyService: any;

  constructor(
    @InjectRepository(Apiary) private apiaryRepository: Repository<Apiary>,
    @InjectRepository(History) private historyRepository: Repository<History>,
    @InjectRepository(Settings) private settingsRepository: Repository<Settings>,
  ) { }




  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCronSubstractOneDay() {
    await this.apiaryRepository.query('CALL SubtractOneDayFromTFence()');
    await this.apiaryRepository.query('CALL SubtractOneDayFromTAmitraz()');
    await this.apiaryRepository.query('CALL SubtractOneDayFromTFlumetrine()');
    await this.apiaryRepository.query('CALL SubtractOneDayFromTOxalic()');
    this.logger.log('Se han restado un día a los valores de los parámetros relacionados con los apiarios.');
  }

  async getAllByUserId(id: number) {
    const apiaryArrayFound: Apiary[] = await this.apiaryRepository.find({
      where: { userId: id },
      relations: ['settings'],
    });

    const apiaryArrayDto: ApiaryDTO[] = [];
    apiaryArrayFound.map((apiary) => {
      const apiaryDto: ApiaryDTO = new ApiaryDTO();

      apiaryDto._id = apiary.id;
      apiaryDto._name = apiary.name;
      apiaryDto._hives = apiary.hives;
      apiaryDto._status = apiary.status;
      apiaryDto._image = apiary.image;
      apiaryDto._honey = apiary.honey;
      apiaryDto._levudex = apiary.levudex;
      apiaryDto._sugar = apiary.sugar;
      apiaryDto._box = apiary.box;
      apiaryDto._boxMedium = apiary.boxMedium;
      apiaryDto._boxSmall = apiary.boxSmall;
      apiaryDto._tOxalic = apiary.tOxalic;
      apiaryDto._tAmitraz = apiary.tAmitraz;
      apiaryDto._tFlumetrine = apiary.tFlumetrine;
      apiaryDto._tFence = apiary.tFence;
      apiaryDto._tComment = apiary.tComment;
      apiaryDto._settings = apiary.settings;
      apiaryDto._updatedAt = apiary.updatedAt;

      apiaryArrayDto.push(apiaryDto);
    });

    return apiaryArrayDto;
  }

  // Async function to get any apiary by id
  async getApiary(id: number): Promise<Apiary | undefined> {
    // searching in the db with where condition id = id and getting the settings row with them
    const foundedApiary = await this.apiaryRepository.findOne({
      where: { id },
      relations: ['settings'],
    });

    // if the apiary with that id isn't founded return undefined
    if (!foundedApiary) {
      return undefined;
    }
    // else return the apiary founded
    return foundedApiary;
  }

  // Async function to create a new apiary passing the user id, apiary info as apiaryDto and the imageUrl
  async createApiary(
    userId: number,
    apiaryDto: createApiaryDto,
  ): Promise<Apiary | undefined> {
    // there are assigning the owner userId and the apiary image url to the object
    // fix that ***
    apiaryDto['userId'] = userId;

    // obtaining the apiary settings from the apiaryDto object, and parsing to object because we recieved that as JSON
    // fix that **
    const settingsDto: createSettingsDto = JSON.parse(apiaryDto.settings);

    // we are separating the settings and the apiary information
    const { settings, ...Apiary } = apiaryDto;

    // attempting to create the apiary
    const newApiary = this.apiaryRepository.create(Apiary);

    // saving the apiary to the db
    const newApiarySaved = await this.apiaryRepository.save(newApiary);

    // setting to the settings the apiary owner id and the apiary id
    const newSettings = this.settingsRepository.create({
      ...settingsDto,
      apiaryId: newApiarySaved.id,
      apiaryUserId: userId,
    });

    // saving the settings to the db
    const newSettingsSaved = await this.settingsRepository.save(newSettings);

    // returning the newly created Apiary and its associated Settings
    return { ...newApiarySaved, settings: newSettingsSaved };
  }

  // Function to delete an apiary passing the apiaryId, and userId
  async deleteApiary(
    id: number,
  ): Promise<DeleteResult | undefined> {
    // we search if find any apiary with that id and user
    const foundedApiary = await this.apiaryRepository.findOne({
      where: { id },
    });

    // if not found anyone return undefined
    if (!foundedApiary) {
      return undefined;
    }

    // else attempt to delete the apiary
    const deletedApiary = await this.apiaryRepository.delete({ id });

    // return the result of the attempt
    return deletedApiary;
  }

  // Function to update an apiary passing the apiaryId, and the updated data as updateApiaryDto
  async updateApiary(id: number, apiary: updateApiaryDto): Promise<Apiary | undefined> {

    try {
      // Search for the apiary by id
      const apiaryFound = await this.apiaryRepository.findOne({ where: { id } });

      // If no apiary found, return undefined
      if (!apiaryFound) {
        return undefined;
      }

      // Update the apiary
      await this.apiaryRepository.update({ id }, { ...apiaryFound, ...apiary });

      // Retrieve the updated apiary
      const updatedApiary = await this.apiaryRepository.findOne({ where: { id } });


      // Return the updated apiary
      return updatedApiary;

    } catch (error) {
      // Handle and throw a custom error if necessary
      throw new Error('Error updating apiary');
    }
  }

  // Function to get the apiary settings passing the settings id
  async getSettings(id: number): Promise<Settings | undefined> {
    // searching the settings where condition is id
    const settingsFound = await this.settingsRepository.findOne({
      where: { id },
    });

    // if settings not founded return undefined
    if (!settingsFound) {
      return undefined;
    }

    // else return the settings
    return settingsFound;
  }

  // Function to update the apiary settings passing the settings id and the settings updated
  async updateSettings(id: number, settings: updateSettingsDto): Promise<UpdateResult | undefined> {
    // searching the if the settings with that id has pass exists
    const settingsFound = await this.settingsRepository.findOne({
      where: { id },
    });

    // if settings not founded return undefined
    if (!settingsFound) {
      return undefined;
    }

    // else attempt to update the settings
    const updatedSettings = await this.settingsRepository.update(
      { id },
      settings,
    );

    // return the result of the attempt
    return updatedSettings;
  }

  async deleteSettings(id: number): Promise<DeleteResult | undefined> {
    // searching the if the settings with that id has pass exists
    const settingsFound = await this.settingsRepository.findOne({
      where: { id },
    });

    // if settings not founded return undefined
    if (!settingsFound) {
      return undefined;
    }

    // else attempt to delete the settings
    const deletedSettings = this.settingsRepository.delete(id);

    // return the result of the attempt
    return deletedSettings;
  }

  // function to get all the history of an apiary passing the apiary id
  async getAllHistory(apiaryId: number): Promise<History[] | undefined> {
    // checks that exist any history of that apiary
    const historyFounded = await this.historyRepository.find({
      where: { apiaryId },
    });

    // if dont exists return undefined
    if (!historyFounded) {
      return undefined
    }

    // return the result of the attempt
    return historyFounded;
  }

  // CREATE SETTINGS USELESS FOR NOW!!
  // async createSettings(apiaryId: number, settings: createSettingsDto) {
  //   const apiaryFound = await this.apiaryRepository.findOne({
  //     where: { id: apiaryId },
  //   });

  //   if (!apiaryFound) {
  //     return undefined;
  //   }

  //   const newSettings = this.settingsRepository.create(settings);
  //   const savedSettings = await this.settingsRepository.save(newSettings);

  //   apiaryFound.settings = savedSettings;

  //   return this.apiaryRepository.save(apiaryFound);
  // }
}
