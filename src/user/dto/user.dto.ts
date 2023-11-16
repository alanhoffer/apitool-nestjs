import { IsNotEmpty, IsEmail, IsDateString, IsIn } from 'class-validator';
export class UserDto {

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsEmail()
  email: string;

  @IsDateString()
  createdAt: Date;

  @IsIn([])
  role: string;
}