import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Settings } from './settings.entity';
import { updateSettingsDto } from './dto/update-settings.dto';
import { createSettingsDto } from './dto/create-settings.dto';



@Injectable()
export class SettingsService {

  private readonly logger = new Logger(SettingsService.name)

  constructor(
    @InjectRepository(Settings) private settingsRepository: Repository<Settings>,
  ) { }


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

      async setHarvestingForAllApiaries(userId: number, harvesting: boolean): Promise<void> {
        try {
          const result = await this.settingsRepository.update(
            { apiaryUserId: userId },
            { harvesting },
          );
    
          if (result.affected === 0) {
            throw new NotFoundException('No settings found for the given user.');
          }
        } catch (error) {
          throw new InternalServerErrorException('Failed to update harvesting status.');
        }
      }
}