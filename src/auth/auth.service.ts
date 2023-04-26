import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jtwService: JwtService,
    ) { }

    async signIn(email: string, pass: string): Promise<any> {

        const user = await this.usersService.getUserByEmail(email);


        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }

        const payload = { username: user.email, sub: user.id };

        return {
            access_token: await this.jtwService.signAsync(payload)
        };
    }

    async signUp(signUpDto: createUserDto) {

        const createdUser = await this.usersService.createUser(signUpDto);

        if (!createdUser) {
            return new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        return createdUser;

    }


}
