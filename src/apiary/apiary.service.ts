import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Apiary } from './apiary.entity';
import { createApiaryDto } from './dto/create-apiary.dto';
import { Settings } from './setting/settings.entity';
import { updateApiaryDto } from './dto/update-apiary.dto';
import { createSettingsDto } from './setting/dto/create-settings.dto';
import { History } from './history/history.entity';
import { ApiaryDTO } from './dto/apiary.dto';
import { HistoryService } from './history/history.service';
import { SettingsService } from './setting/settings.service';

@Injectable()
export class ApiaryService {

  private readonly logger = new Logger(ApiaryService.name);

  constructor(
    @InjectRepository(Apiary) private apiaryRepository: Repository<Apiary>,
    @InjectRepository(History) private historyRepository: Repository<History>,
    @InjectRepository(Settings) private settingsRepository: Repository<Settings>,
    private historyService: HistoryService,
    private settingsService: SettingsService,
  ) {}

  async getAllByUserId(userId: number): Promise<ApiaryDTO[]> {
    try {
      const apiaryArrayFound: Apiary[] = await this.apiaryRepository.find({
        where: { userId: userId },
        relations: ['settings'],
      });

      const apiaryArrayDto: ApiaryDTO[] = apiaryArrayFound.map((apiary) => {
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
        apiaryDto._transhumance = apiary.transhumance;
        apiaryDto._settings = apiary.settings;
        apiaryDto._updatedAt = apiary.updatedAt;

        return apiaryDto;
      });

      return apiaryArrayDto;
    } catch (error) {
      this.logger.error('Error al obtener los apiarios del usuario.', error.stack);
      throw error;
    }
  }

  async getApiary(id: number): Promise<Apiary | undefined> {
    try {
      const foundedApiary = await this.apiaryRepository.findOne({
        where: { id },
        relations: ['settings'],
      });

      if (!foundedApiary) {
        this.logger.warn(`Apiary with id ${id} not found.`);
        return undefined;
      }

      return foundedApiary;
    } catch (error) {
      this.logger.error(`Error al obtener el apiario con id ${id}.`, error.stack);
      throw error;
    }
  }

  async createApiary(
    userId: number,
    apiaryDto: createApiaryDto,
  ): Promise<Apiary> {
    try {
      // Asignar el userId al DTO del apiario
      apiaryDto.userId = userId;
  
      // Analizar la configuración y separarla del DTO del apiario
      const settingsDto: createSettingsDto = JSON.parse(apiaryDto.settings || '{}');
      const { settings, ...apiaryData } = apiaryDto;
  
      // Crear una instancia del apiario usando el DTO (los valores undefined se manejan según el modelo de la entidad)
      const newApiary = this.apiaryRepository.create(apiaryData);
  
      // Guardar el nuevo apiario en la base de datos
      const newApiarySaved = await this.apiaryRepository.save(newApiary);
  
      // Crear una instancia de configuraciones asociadas al nuevo apiario
      const newSettings = this.settingsRepository.create({
        ...settingsDto,
        apiaryId: newApiarySaved.id,
        apiaryUserId: userId,
      });
  
      // Guardar las nuevas configuraciones en la base de datos
      const newSettingsSaved = await this.settingsRepository.save(newSettings);
  
      // Devolver el nuevo apiario junto con sus configuraciones
      return { ...newApiarySaved, settings: newSettingsSaved };
    } catch (error) {
      this.logger.error('Error al crear el apiario.', error.stack);
      throw new InternalServerErrorException('Error al crear el apiario.');
    }
  }
  

  async deleteApiary(id: number): Promise<DeleteResult | undefined> {
    try {
      const foundedApiary = await this.apiaryRepository.findOne({
        where: { id },
      });

      if (!foundedApiary) {
        this.logger.warn(`Apiary with id ${id} not found.`);
        return undefined;
      }

      const deletedApiary = await this.apiaryRepository.delete({ id });
      this.logger.log(`Apiary with id ${id} deleted successfully.`);
      return deletedApiary;
    } catch (error) {
      this.logger.error(`Error al eliminar el apiario con id ${id}.`, error.stack);
      throw error;
    }
  }

  async updateApiary(id: number, apiaryDto: updateApiaryDto): Promise<Apiary | undefined> {
    try {
      const apiaryFound = await this.apiaryRepository.findOne({ where: { id } });

      if (!apiaryFound) {
        this.logger.warn(`Apiary with id ${id} not found.`);
        return undefined;
      }

      await this.apiaryRepository.update({ id }, { ...apiaryFound, ...apiaryDto });
      const updatedApiary = await this.apiaryRepository.findOne({ where: { id } });

      await this.historyService.logChanges(apiaryFound, updatedApiary)

      this.logger.log(`Apiary with id ${id} updated successfully.`);
      return updatedApiary;
    } catch (error) {
      this.logger.error(`Error al actualizar el apiario con id ${id}.`, error.stack);
      throw error;
    }
  }

  async getAllHistory(apiaryId: number): Promise<History[] | undefined> {
    try {
      const historyFounded = await this.historyRepository.find({
        where: { apiaryId },
      });

      if (!historyFounded) {
        this.logger.warn(`No history found for apiary with id ${apiaryId}.`);
        return undefined;
      }

      return historyFounded;
    } catch (error) {
      this.logger.error(`Error al obtener el historial del apiario con id ${apiaryId}.`, error.stack);
      throw error;
    }
  }

  async countApiariesByUserId(userId: number): Promise<number> {
    return this.apiaryRepository.count({ where: { userId } });
  }
  
  async countHivesByUserId(userId: number): Promise<number> {

    
    const apiaries = await this.apiaryRepository.find({
      where: { userId }, // Asegúrate de que la relación con las colmenas esté incluida
    });
    // Sumar la cantidad total de colmenas de todos los apiarios
    const totalHives = apiaries.reduce((sum, apiary) => sum + apiary.hives, 0);

    
  
    return totalHives;
  }

  async subtractFood(): Promise<void> {
    try {
      const queryRunner = this.apiaryRepository.manager; // Usa el manager del repositorio
      await queryRunner.query('CALL SubtractFood()'); // Llama al procedimiento almacenado para alimentos
      this.logger.log('Se han actualizado los valores de alimentos en los apiarios.');
    } catch (error) {
      this.logger.error('Error al actualizar los valores de alimentos en los apiarios.', error.stack);
      throw error;
    }
  }

  async subtractOneDayTreatment(treatmentType: string): Promise<void> {
    try {
      const queryRunner = this.apiaryRepository.manager; // Usa el manager del repositorio
      await queryRunner.query('CALL SubtractOneDayTreatment($1)', [treatmentType]); // Llama al procedimiento almacenado para tratamientos
      this.logger.log(`Se ha restado un día al tratamiento: ${treatmentType}.`);
    } catch (error) {
      this.logger.error(`Error al restar un día al tratamiento: ${treatmentType}.`, error.stack);
      throw error;
    }
  }
}
