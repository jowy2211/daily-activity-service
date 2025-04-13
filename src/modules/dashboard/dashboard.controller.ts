import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from 'src/utils';
import { UserRole } from 'src/utils/helper/enum.utils';
import { DashboardService } from './dashboard.service';
import {
  ActivityTrendDto,
  ProductivityDto,
  ProjectPerformanceDto,
  WorkloadDto,
} from './dto/dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('project-performance')
  @UseGuards(
    AuthGuard,
    new RolesGuard([UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.STAFF]),
  )
  async getProjectPerformance(
    @Query() query: ProjectPerformanceDto,
    @Req() req: any,
  ): Promise<ProjectPerformanceDto> {
    return this.dashboardService.getProjectPerformance(query, req?.user?.id);
  }

  @Get('workload')
  async getWorkload(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<WorkloadDto> {
    return this.dashboardService.getWorkload(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('productivity')
  async getProductivity(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ProductivityDto> {
    return this.dashboardService.getProductivity(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('activity-trend')
  async getActivityTrend(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ActivityTrendDto> {
    return this.dashboardService.getActivityTrend(
      new Date(startDate),
      new Date(endDate),
    );
  }
}
