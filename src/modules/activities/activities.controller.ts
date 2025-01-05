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
import { AuthGuard, ParamsTableDto } from 'src/utils';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

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
  findMany(@Query() params: ParamsTableDto, @Req() req: any) {
    return this.activitiesService.findMany(params, req.user.id);
  }

  @Get(':member_id')
  findAll(
    @Query() params: ParamsTableDto,
    @Param('member_id') member_id: string,
  ) {
    return this.activitiesService.findAll(params, member_id);
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
