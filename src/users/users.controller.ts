import { Body, Controller, Get, Param, Post, ParseIntPipe, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }





}
