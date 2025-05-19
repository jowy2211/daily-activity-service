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

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller()
@UseInterceptors(ResponseInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Users
  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMIN]))
  async create(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  @Get('users')
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMIN]))
  async findAll(@Query() query: ParamsTableDto, @Req() req: any) {
    return await this.usersService.findAll(query, req.user.id);
  }

  @Get('users/:code')
  @UseGuards(AuthGuard)
  async findOne(@Param('code') code: string) {
    return await this.usersService.findOne(code);
  }

  @Patch('users/:code')
  @UseGuards(AuthGuard)
  update(@Param('code') code: string, @Body() payload: UpdateUserDto) {
    return this.usersService.update(code, payload);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMIN]))
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Employee
  @Get('employees')
  @UseGuards(AuthGuard)
  async findEmployee(@Req() req: any, @Query('code') code: string) {
    return await this.usersService.findAllEmployee(req.user.id, code);
  }
}
