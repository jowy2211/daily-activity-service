import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { AuthGuard, ParamsTableDto } from 'src/utils';

@Controller('activities')
@UseGuards(AuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateActivityDto) {
    return this.activitiesService.create(payload);
  }

  @Get()
  findAll(@Query() params: ParamsTableDto) {
    return this.activitiesService.findAll(params);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.activitiesService.findOne(code);
  }

  @Patch(':code')
  update(@Param('code') code: string, @Body() payload: UpdateActivityDto) {
    return this.activitiesService.update(code, payload);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('code') code: string) {
    return this.activitiesService.remove(code);
  }
}
