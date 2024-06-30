import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '../../utils/guard/auth.guard';

@Controller('auth')
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
