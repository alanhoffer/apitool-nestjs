import { Controller, Get, HttpStatus, HttpException, Param, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';


@Controller('users')
export class UsersController {

    constructor(
        private userService: UserService
    ) { }

    @UseGuards(AuthGuard)
    @Get('')
    async getUser(
        @Request() req,
    ): Promise<User | HttpException> {
    
        // Obtiene el usuario usando el ID del usuario autenticado
        const foundUser = await this.userService.getUser(req.user.sub);
    
        // Si el usuario no existe, lanza una excepción
        if (!foundUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        // Comprueba si el usuario autenticado es el propietario del usuario encontrado
        if (foundUser.id !== req.user.sub) {
            throw new HttpException('This user is not yours', HttpStatus.UNAUTHORIZED);
        }
    
        // Si todo está bien, devuelve el usuario encontrado
        return foundUser;
    }
    
}
