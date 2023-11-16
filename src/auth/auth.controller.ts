import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Request, Get, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { createUserDto } from '../user/dto/create-user.dto';
import { loginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto:loginUserDto) {
        const response = await this.authService.signIn(signInDto);
        return response
    }

    @Post('register')
    signUp(@Body() signUpDto: createUserDto) {
        return this.authService.signUp(signUpDto);

    }

    @UseGuards(AuthGuard)
    @Post('logout')
    signOut(@Body() signOut: Record<string, any>) {
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    profile(@Request() req) {
        return req.user;
    }
}
