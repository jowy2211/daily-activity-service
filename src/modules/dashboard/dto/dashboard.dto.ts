import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProjectPerformanceDto {
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @IsString()
  @IsOptional()
  project_id?: string;
}
export class WorkloadDto {
  totalHours: {
    employeeId: string;
    employeeName: string;
    totalHours: number;
  }[];
  projectCount: {
    employeeId: string;
    employeeName: string;
    projectCount: number;
  }[];
  avgDailyHours: {
    employeeId: string;
    employeeName: string;
    avgHours: number;
  }[];
  activityDistribution: {
    employeeId: string;
    category: string;
    percentage: number;
  }[];
  overworkAlerts: {
    employeeId: string;
    employeeName: string;
    projectCount: number;
  }[];
}

export class ProductivityDto {
  activityByCategory: { category: string; count: number }[];
  productivityRatio: { type: string; percentage: number }[];
  hoursByPosition: { position: string; totalHours: number }[];
  meetingFrequency: { projectId: string; week: string; count: number }[];
  activitiesPerProject: {
    projectId: string;
    taskCount: number;
    bugFixingCount: number;
  }[];
}

export class ActivityTrendDto {
  monthlyHours: { month: string; projectId: string; totalHours: number }[];
  categoryTrend: { month: string; category: string; count: number }[];
  productiveDays: {
    employeeId: string;
    employeeName: string;
    productiveDays: number;
  }[];
  workloadPeaks: { week: string; totalHours: number }[];
  activityEfficiency: { category: string; avgHours: number }[];
}

export class RiskComplianceDto {
  overworkEmployees: {
    employeeId: string;
    employeeName: string;
    projectCount: number;
  }[];
  nonStandardDays: { date: string; activityCount: number }[];
  riskyProjects: {
    projectId: string;
    projectName: string;
    delayDays: number;
    bugFixingRatio: number;
  }[];
  hoursCompliance: {
    employeeId: string;
    employeeName: string;
    overHoursDays: number;
  }[];
  workloadVariance: {
    employeeId: string;
    employeeName: string;
    variance: number;
  }[];
}
