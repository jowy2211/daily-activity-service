import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { UserRole } from 'src/utils/helper/enum.utils';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(
  AuthGuard,
  new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
)
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
