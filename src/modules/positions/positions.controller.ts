import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { AuthGuard, ParamsTableDto, RolesGuard } from 'src/utils';
import { UserRole } from 'src/utils/helper/enum.utils';

@Controller('positions')
@UseGuards(AuthGuard, new RolesGuard([UserRole.ADMIN, UserRole.EXECUTIVE]))
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  async create(@Body() payload: CreatePositionDto) {
    return await this.positionsService.create(payload);
  }

  @Get()
  async findAll(@Query() params: ParamsTableDto) {
    return await this.positionsService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.positionsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdatePositionDto) {
    return await this.positionsService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.positionsService.remove(id);
  }
}
