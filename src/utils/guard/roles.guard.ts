import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '../helper/enum.utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: UserRole[]) {}

  canActivate(context: ExecutionContext): boolean {
    if (!this.roles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('roles : ', this.roles);
    console.log('request user : ', user);

    if (!user?.role?.code) throw new UnauthorizedException();

    const checkRoles = this.roles.includes(user?.role?.code);

    if (!checkRoles) throw new ForbiddenException();

    return true;
  }
}
