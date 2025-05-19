import {
  AuthGuard,
  ResponseInterceptor,
  RolesGuard,
} from 'src/utils';
import { UserRole } from 'src/utils/helper/enum.utils';

import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import {
  ActivityTrendDto,
  ProductivityDto,
  ProjectPerformanceDto,
  WorkloadDto,
} from './dto/dashboard.dto';

@Controller('dashboard')
@UseInterceptors(ResponseInterceptor)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('project-performance')
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  )
  async getProjectPerformance(
    @Query() query: ProjectPerformanceDto,
    @Req() req: any,
  ) {
    return this.dashboardService.getProjectPerformance(query, req?.user?.id);
  }

  @Get('workload')
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  )
  async getWorkload(@Query() query: WorkloadDto, @Req() req: any) {
    return this.dashboardService.getWorkload(query, req?.user?.id);
  }

  @Get('productivity')
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  )
  async getProductivity(@Query() query: ProductivityDto, @Req() req: any) {
    return this.dashboardService.getProductivity(query, req?.user?.id);
  }

  @Get('activity-trend')
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
  )
  async getActivityTrend(@Query() query: ActivityTrendDto, @Req() req: any) {
    return this.dashboardService.getActivityTrend(query, req?.user?.id);
  }
}
