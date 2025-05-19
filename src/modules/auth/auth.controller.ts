import { ResponseInterceptor } from 'src/utils';

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthGuard } from '../../utils/guard/auth.guard';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: AuthDto) {
    return await this.authService.login(payload);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async detail(@Req() req: any) {
    return await this.authService.detail(req.user);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Req() req: any) {
    return await this.authService.logout(req.user);
  }
}
