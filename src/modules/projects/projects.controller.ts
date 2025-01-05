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
} from '@nestjs/common';
import { AuthGuard, ParamsTableDto, RolesGuard } from 'src/utils';
import { UserRole } from 'src/utils/helper/enum.utils';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  UpdateProjectDto,
  UpdateStatusProjectDto,
} from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('portal')
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMIN, UserRole.EXECUTIVE]))
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
    new RolesGuard([UserRole.ADMIN, UserRole.EXECUTIVE, UserRole.STAFF]),
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
  async findOne(@Param('code') code: string, @Req() req: any) {
    return await this.projectsService.findOne(code, req.user.id);
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
