import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { UserRole } from 'src/utils/helper/enum.utils';
import { AuthGuard } from 'src/utils';

@Controller('roles')
@UseGuards(AuthGuard, new RolesGuard([UserRole.ADMIN, UserRole.EXECUTIVE]))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
