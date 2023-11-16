import { IsEmail, IsNotEmpty, IsNumber, MinLength, ValidateNested } from 'class-validator';

export class createUserDto {

    @IsNotEmpty()
    @MinLength(3)
    name: string;
  
    @IsNotEmpty()
    @MinLength(3)
    surname: string;
  
    @IsEmail()
    email: string;
    
    @MinLength(7)
    password: string;
  }