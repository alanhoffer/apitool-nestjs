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
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { ApiarysService } from './apiarys.service';
import { createApiaryDto } from './dto/apiary/create-apiary.dto';
import { updateApiaryDto } from './dto/apiary/update-apiary.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { updateSettingsDto } from './dto/settings/update-settings.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { of } from 'rxjs';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { Apiary } from './apiary.entity';
import { UsersService } from 'src/users/users.service';

@Controller('apiarys')
export class ApiarysController {
  constructor(
    private apiarysService: ApiarysService,
    private usersService: UsersService,
  ) {}

  // requests that we can manage the (apiary, apiary settings, apiary history)
  // AuthGuard checks that u have logged in or if ur JWT is valid
  // we use req.user.sub to check access or the permission to that request
  // ParseIntPipe make ur param to INT type

  @UseGuards(AuthGuard)
  @Get(':id')
  async getApiary(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Apiary | HttpException> {
    // getting the apiary passing the Param id
    const foundedApiary = await this.apiarysService.getApiary(id);

    // if apiary is null will return new HttpException
    if (!foundedApiary) {
      return new HttpException('Apiary not exists', HttpStatus.NOT_FOUND);
    }

    // else we check if the user that makes the request have ownership to that apiary founded
    // if isn't the owner will return an HttpException
    if (foundedApiary.user != req.user.sub) {
      return new HttpException(
        'This apiary is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // else if is the owner will return the apiary founded
    return foundedApiary;
  }

  // on this request will be posting new apiary
  // we are using Interceptors to get the image file, setting a random name generated by uuid and saving it with multer
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',

        filename: (req, file, cb) => {
          const filename: string = uuidv4();
          const extension: string = file.originalname.split('.').pop();
          console.log(file);
          cb(null, `${filename}.${extension}`);
        },
      }),
    }),
  )
  async createApiary(
    @Request() req,
    @Body() apiary: createApiaryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Apiary | HttpException> {

    console.log(apiary)    // this consts were obtained by the request and the FileInterceptor result
    const userId = req.user.sub;
    apiary.image = file && `${file.filename}`;


    // check if the user that makes the request exists if not exists will return HttpException
    const foundUser = await this.usersService.getUser(userId);
    if (!foundUser) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // else if exists will attempt to create the apiary passing the userid, request body (apiary information), and file (apiary image)
    const apiaryCreated = this.apiarysService.createApiary(
      userId,
      apiary,
    );

    //
    if (!apiaryCreated) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return apiaryCreated;
  }

  // Uses the AuthGuard to protect the endpoint from unauthorized access.
  // Expects an id parameter and a Request object.
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteApiary(@Request() req, @Param('id', ParseIntPipe) id: number) {
    // Retrieves the apiary with the given id using the apiarysService.
    const foundApiary = await this.apiarysService.getApiary(id);

    // If the apiary doesn't exist, returns a NOT_FOUND HttpException.
    if (!foundApiary) {
      return new HttpException('Apiary not exists', HttpStatus.NOT_FOUND);
    }

    // If the apiary doesn't belong to the authenticated user, returns an UNAUTHORIZED HttpException.
    if (foundApiary.userId != req.user.sub) {
      return new HttpException(
        'This apiary is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // If the apiary exists and belongs to the authenticated user, deletes it using the apiarysService.
    return this.apiarysService.deleteApiary(foundApiary.id);
  }

  // Uses the AuthGuard to protect the endpoint from unauthorized access.
  // Expects an id parameter, a Request object, and an updateApiaryDto object in the body.
  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',

        filename: (req, file, cb) => {
          const filename: string = uuidv4();
          const extension: string = file.originalname.split('.').pop();
          console.log(file);
          cb(null, `${filename}.${extension}`);
        },
      }),
    }),
  )
  async updateApiary(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() apiary: updateApiaryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {

    
    apiary.image = file && `${file.filename}`;

    // Retrieves the apiary with the given id using the apiarysService.
    const foundApiary = await this.apiarysService.getApiary(id);

    // If the apiary doesn't exist, returns a NOT_FOUND HttpException.
    if (!foundApiary) {
      return new HttpException('Apiary not exists', HttpStatus.NOT_FOUND);
    }

    // If the apiary doesn't belong to the authenticated user, returns an UNAUTHORIZED HttpException.
    if (foundApiary.userId != req.user.sub) {
      return new HttpException(
        'This apiary is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // If the apiary exists and belongs to the authenticated user, updates it using the apiarysService.
    const updatedApiary = await this.apiarysService.updateApiary(id, apiary);
    return updatedApiary;
  }

  @Get('profile/image/:id')
  getFile(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): StreamableFile {
    res.setHeader('Content-Type', 'image/jpeg');
    const imagesPath = '/uploads/';
    const file = createReadStream(join(process.cwd(), imagesPath + id));

    return new StreamableFile(file);
  }

  // Uses the AuthGuard to protect the endpoint from unauthorized access.
  @UseGuards(AuthGuard)
  @Get()
  async getApiarys(@Request() req) {
    // Calls the getAllByUserId method of the apiarysService to retrieve an array of Apiary objects belonging to the authenticated user.
    const apiaryArrayFound = this.apiarysService.getAllByUserId(req.user.sub);

    // If the array of Apiary objects is empty, returns a NOT_FOUND HttpException.
    if (!apiaryArrayFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // If the array of Apiary objects is not empty, returns the array of Apiary objects.
    return apiaryArrayFound;
  }

  // Uses the AuthGuard to protect the endpoint from unauthorized access.
  @UseGuards(AuthGuard)
  @Get('history/:id')
  async getApiaryHistory(
    @Request() req,
    @Param('id', ParseIntPipe) apiaryId: number,
  ) {
    // Calls the getApiary method of the apiarysService to retrieve the Apiary object with the given apiaryId.
    const apiaryFound = await this.apiarysService.getApiary(apiaryId);

    // If the Apiary object is not found, returns a NOT_FOUND HttpException.
    if (!apiaryFound) {
      return new HttpException('This apiary not exists', HttpStatus.NOT_FOUND);
    }

    // If the authenticated user doesn't own the Apiary object, returns an UNAUTHORIZED HttpException.
    if (apiaryFound.userId != req.user.sub) {
      return new HttpException(
        'This apiary is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Calls the getAllHistory method of the apiarysService to retrieve an array of History objects belonging to the Apiary object with the given apiaryId.
    const foundHistory = await this.apiarysService.getAllHistory(apiaryId);

    // If the array of History objects is empty, returns an UNAUTHORIZED HttpException.
    if (!foundHistory) {
      return new HttpException(
        'This history is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // If the array of History objects is not empty, returns the array of History objects.
    return foundHistory;
  }

  // This route requires an authenticated user to access it
  @UseGuards(AuthGuard)
  // This route allows the user to update the settings of a specific apiary by ID
  @Put('settings/:id')
  async updateApiarySettings(
    // The current request object is passed as an argument
    @Request() req,
    // The ID of the settings to update is passed as a parameter and is validated as an integer
    @Param('id', ParseIntPipe) settingsId: number,
    // The updated settings object is passed in the request body
    @Body() updateSettingsDto: updateSettingsDto,
  ) {
    // If the user ID in the updated settings object does not match the current user's ID,
    // return an unauthorized error response
    if (updateSettingsDto.apiaryUserId != req.user.sub) {
      return new HttpException(
        'This settings is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Get the existing settings for the specified ID
    const foundSettings = await this.apiarysService.getSettings(settingsId);

    // If the APIary ID in the updated settings object does not match the APIary ID
    // of the found settings, return an unauthorized error response
    if (updateSettingsDto.apiaryId != foundSettings.apiaryId) {
      return new HttpException(
        'This settings is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // If the specified settings ID is not found, return a not found error response
    if (!foundSettings) {
      return new HttpException('Settings not exists', HttpStatus.NOT_FOUND);
    }

    // Otherwise, update the settings using the provided DTO object
    return this.apiarysService.updateSettings(settingsId, updateSettingsDto);
  }
}
