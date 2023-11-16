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
    @Get(':id')
    async getUser(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<User | HttpException> {

        // Obtiene el usuario pasando el parámetro 'id'
        const foundUser = await this.userService.getUser(id);
        // Si el usuario no existe, devuelve una nueva HttpException
        if (!foundUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // Comprueba si el usuario que realiza la solicitud es propietario de ese usuario encontrado
        // Si no es el propietario, devuelve una HttpException
        if (foundUser.id !== req.user.sub) {
            throw new HttpException('This user is not yours', HttpStatus.UNAUTHORIZED);
        }

        

        // Si es el propietario, devuelve el usuario encontrado
        return foundUser;
    }
}
