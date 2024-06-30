import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard, ParamsTableDto, RolesGuard } from 'src/utils';
import { UserRole } from 'src/utils/helper/enum.utils';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('portal')
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMIN, UserRole.EXECUTIVE]))
  async findAll(@Query() params: ParamsTableDto) {
    return await this.projectsService.findAll(params);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.EXECUTIVE, UserRole.STAFF]),
  )
  async create(@Body() payload: CreateProjectDto) {
    console.log('payload : ', payload);
    return await this.projectsService.create(payload);
  }

  @Get()
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMIN, UserRole.STAFF]))
  async findMany(@Req() req: any, @Query() params: ParamsTableDto) {
    return await this.projectsService.findMany(req.user.id, params);
  }

  @Get(':code')
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.EXECUTIVE, UserRole.STAFF]),
  )
  async findOne(@Param('code') code: string) {
    return await this.projectsService.findOne(code);
  }

  @Patch(':code')
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.EXECUTIVE, UserRole.STAFF]),
  )
  async update(
    @Param('code') code: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectsService.update(code, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMIN, UserRole.EXECUTIVE]))
  async remove(@Param('id') id: string) {
    return await this.projectsService.remove(id);
  }
}
