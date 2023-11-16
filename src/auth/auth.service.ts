import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { bcryptSaltOrRounds } from './constants';
import { loginUserDto } from 'src/user/dto/login-user.dto';
import { authDataDto } from './dto/auth-data.dto';


@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jtwService: JwtService,
    ) { }

    async signIn(signInDto:loginUserDto): Promise<authDataDto | UnauthorizedException > {

        const user = await this.userService.getUserByEmail(signInDto.email);

        if (!user.validatePassword(signInDto.password)) {
            return new UnauthorizedException();
        }

        const payload = { username: user.email, sub: user.id, role:user.role };

        return {
            user_id: user.id,
            access_token: await this.jtwService.signAsync(payload)
        };
        
    }

    async signUp(signUpDto: createUserDto): Promise<authDataDto | UnauthorizedException> {

        const encryptedPassword = await bcrypt.hash(signUpDto.password, bcryptSaltOrRounds);
        
        signUpDto.password = encryptedPassword;
        
        const createdUser = await this.userService.createUser(signUpDto);

        if (!createdUser) {
            return new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        const user = await this.userService.getUserByEmail(signUpDto.email);


        if (user?.password !== signUpDto.password) {
            throw new UnauthorizedException();
        }

        const payload = { username: user.email, sub: user.id, role: user.role };

        return {
            user_id: user.id,
            access_token: await this.jtwService.signAsync(payload)
        };

    }


}
