import {
  AuthGuard,
  ParamsTableDto,
  ResponseInterceptor,
  RolesGuard,
} from 'src/utils';
import { UserRole } from 'src/utils/helper/enum.utils';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CreateProjectDto } from './dto/create-project.dto';
import {
  UpdateProjectDto,
  UpdateStatusProjectDto,
} from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseInterceptors(ResponseInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('portal')
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  )
  async findAll(@Query() params: ParamsTableDto) {
    return await this.projectsService.findAll(params);
  }

  @Get('logs/:code')
  @UseGuards(AuthGuard)
  async findManyLogsByCode(@Param('code') code: string, @Req() req: any) {
    return await this.projectsService.findManyLogs(code, req.user.id);
  }

  @Patch('status/:code')
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.STAFF]),
  )
  async updateStatus(
    @Param('code') code: string,
    @Body() payload: UpdateStatusProjectDto,
  ) {
    return await this.projectsService.updateStatus(code, payload);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.STAFF]),
  )
  async create(@Body() payload: CreateProjectDto) {
    console.log('payload : ', payload);
    return await this.projectsService.create(payload);
  }

  @Get()
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.STAFF]),
  )
  async findMany(@Req() req: any, @Query() params: ParamsTableDto) {
    const isStaff =
      req?.user?.role?.code !== UserRole.ADMIN ? req.user.id : null;
    return await this.projectsService.findMany(params, isStaff);
  }

  @Get(':code')
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.STAFF]),
  )
  async findOne(@Param('code') code: string, @Req() req: any) {
    return await this.projectsService.findOne(code, req.user.id);
  }

  @Patch(':code')
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.STAFF]),
  )
  async update(
    @Param('code') code: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectsService.update(code, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  )
  async remove(@Param('id') id: string) {
    return await this.projectsService.remove(id);
  }
}
