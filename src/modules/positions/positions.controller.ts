import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, ParamsTableDto, RolesGuard } from 'src/utils';
import { UserRole } from 'src/utils/helper/enum.utils';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsService } from './positions.service';

@Controller('positions')
@UseGuards(
  AuthGuard,
  new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) { }

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
