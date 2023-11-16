import { IsEmail, MinLength } from 'class-validator';

export class loginUserDto {

    @IsEmail()
    email: string;
    
    @MinLength(7)
    password: string;

  }