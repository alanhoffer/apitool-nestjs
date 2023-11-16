import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.get<string>('role', context.getHandler());
    if (!requiredRole) {
      // Si no se especifica ningún rol requerido, se permite el acceso
      return true;
    }

    // si se especifica tu vieja lo deja pasar a tu casa
    const request = context.switchToHttp().getRequest();
    const user: User = request.user; 
    
    console.log(request.user)
    if(user){
      const hasRole = requiredRole === user.role;
      return hasRole;
    }

    return false;
  }
}
