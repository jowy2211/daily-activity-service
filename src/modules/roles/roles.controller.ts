import {
  AuthGuard,
  ResponseInterceptor,
} from 'src/utils';
import { RolesGuard } from 'src/utils/guard/roles.guard';
import { UserRole } from 'src/utils/helper/enum.utils';

import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { RolesService } from './roles.service';

@Controller('roles')
@UseInterceptors(ResponseInterceptor)
@UseGuards(
  AuthGuard,
  new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
