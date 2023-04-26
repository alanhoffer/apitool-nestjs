import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Request, Get, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { createUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        const response = await this.authService.signIn(signInDto.email, signInDto.password);
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
