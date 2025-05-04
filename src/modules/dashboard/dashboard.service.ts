import { PrismaService } from 'nestjs-prisma';
import { UserRole } from 'src/utils/helper/enum.utils';

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  ActivityTrendDto,
  ProductivityDto,
  ProjectPerformanceDto,
  WorkloadDto,
} from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

  // 1. Dashboard Kinerja Proyek --- START
  async getProjectPerformance(
    query: ProjectPerformanceDto,
    user_id?: string | undefined,
  ): Promise<any> {
    const startDate = new Date(query.start_date);
    const endDate = new Date(query.end_date);

    // 0. Get User
    const user = await this.prisma.users.findUnique({
      where: { id: user_id },
      include: { role: true },
    });

    let whereQueries: Prisma.projectsWhereInput = {
      start_date: { gte: startDate },
      end_date: { lte: endDate },
    };

    if (query?.project_id) {
      whereQueries = {
        ...whereQueries,
        id: query.project_id,
      };
    }

    if (user && user.role.code === UserRole.PROJECT_MANAGER) {
      whereQueries = {
        ...whereQueries,
        member: {
          some: {
            employee: {
              user_id,
            },
          },
        },
      };
    }

    const projects = await this.prisma.projects.findMany({
      where: {
        ...whereQueries,
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    // 1. Total Jam Kerja per Proyek
    // Mengganti groupBy dengan findMany dan in-memory aggregation
    const activities = await this.prisma.activities.findMany({
      where: {
        date_at: { gte: startDate, lte: endDate },
        member: {
          project_id: { in: projects.map((i) => i.id) },
        },
      },
      select: {
        time_spent: true,
        member: {
          select: {
            project_id: true,
          },
        },
      },
    });

    const hoursPerProject = activities.reduce((acc, activity) => {
      const projectId = activity.member.project_id;
      acc[projectId] = (acc[projectId] || 0) + activity.time_spent;
      return acc;
    }, {} as Record<string, number>);

    const hoursData = await Promise.all(
      Object.entries(hoursPerProject).map(async ([projectId, totalHours]) => {
        const project = await this.prisma.projects.findUnique({
          where: { id: projectId },
          select: { name: true },
        });
        return {
          projectId,
          projectName: project.name,
          totalHours,
        };
      }),
    );

    // 2. Distribusi Aktivitas per Proyek
    const activityDist = await this.prisma.activities.findMany({
      where: {
        date_at: { gte: startDate, lte: endDate },
        member: {
          project_id: { in: projects.map((i) => i.id) },
        },
      },
      select: {
        category: true,
        member: {
          select: {
            project: {
              select: {
                name: true,
              },
            },
            project_id: true,
          },
        },
      },
    });

    const activityCounts = activityDist.reduce((acc, activity) => {
      const projectId = activity.member.project_id;
      const category = activity.category;
      if (!acc[projectId]) {
        acc[projectId] = {};
      }
      acc[projectId][category] = (acc[projectId][category] || 0) + 1;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    const totalActivitiesPerProject = activityDist.reduce((acc, activity) => {
      const projectId = activity.member.project_id;
      acc[projectId] = (acc[projectId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Transformasi menjadi array 2 dimensi berdasarkan project_id
    const activityData: {
      projectId: string;
      category: string;
      percentage: number;
    }[][] = Object.entries(activityCounts).map(([projectId, categories]) => {
      return Object.entries(categories).map(([category, count]) => ({
        projectId,
        category,
        percentage: (count / (totalActivitiesPerProject[projectId] || 1)) * 100,
      }));
    });

    return {
      hoursPerProject: hoursData,
      activityDistribution: activityData,
    };
  }
  // 1. Dashboard Kinerja Proyek --- END

  // 2. Dashboard Beban Kerja Karyawan --- START
  async getWorkload(
    query: WorkloadDto,
    user_id?: string | undefined,
  ): Promise<any> {
    const startDate = new Date(query.start_date);
    const endDate = new Date(query.end_date);

    // 0. Get User
    const user = await this.prisma.users.findUnique({
      where: { id: user_id },
      include: { role: true },
    });

    let whereQueries: Prisma.projectsWhereInput = {
      start_date: { gte: startDate },
      end_date: { lte: endDate },
    };

    if (query?.project_id) {
      whereQueries = {
        ...whereQueries,
        id: query.project_id,
      };
    }

    if (user && user.role.code === UserRole.PROJECT_MANAGER) {
      whereQueries = {
        ...whereQueries,
        member: {
          some: {
            employee: {
              user_id,
            },
          },
        },
      };
    }

    const projects = await this.prisma.projects.findMany({
      where: {
        ...whereQueries,
      },
      select: {
        id: true,
        status: true,
      },
    });

    // 1. Total Jam Kerja per Karyawan
    // Mengganti groupBy dengan findMany dan in-memory aggregation
    const activities = await this.prisma.activities.findMany({
      where: {
        date_at: { gte: startDate, lte: endDate },
        member: {
          project: {
            id: {
              in: projects.map((i) => i.id),
            },
          },
        },
      },
      select: {
        member_id: true,
        time_spent: true,
        date_at: true,
        category: true,
        member: {
          select: {
            employee: {
              select: {
                id: true,
                fullname: true,
              },
            },
          },
        },
      },
    });
    const totalHoursMap = activities.reduce((acc, activity) => {
      const employeeId = activity.member.employee.id;
      const employeeName = activity.member.employee.fullname;
      if (!acc[employeeId]) {
        acc[employeeId] = { employeeId, employeeName, totalHours: 0 };
      }
      acc[employeeId].totalHours += activity.time_spent;
      return acc;
    }, {} as Record<string, { employeeId: string; employeeName: string; totalHours: number }>);
    const hoursData = Object.values(totalHoursMap);

    // 2. Jumlah Proyek per Karyawan
    // Mengganti groupBy dengan findMany dan in-memory counting
    const members = await this.prisma.members.findMany({
      where: {
        project: {
          id: { in: projects.map((i) => i.id) },
        },
      },
      select: {
        employee_id: true,
        project_id: true,
        employee: {
          select: {
            fullname: true,
          },
        },
      },
    });
    const projectCountMap = members.reduce((acc, member) => {
      const employeeId = member.employee_id;
      const employeeName = member.employee.fullname;
      if (!acc[employeeId]) {
        acc[employeeId] = { employeeId, employeeName, projectCount: 0 };
      }
      acc[employeeId].projectCount += 1;
      return acc;
    }, {} as Record<string, { employeeId: string; employeeName: string; projectCount: number }>);
    const projectData = Object.values(projectCountMap);

    // 3. Rata-rata Jam Harian
    // Mengganti groupBy dengan in-memory aggregation berdasarkan activities
    const dailyHoursMap = activities.reduce((acc, activity) => {
      const employeeId = activity.member.employee.id;
      const dateKey = activity.date_at.toISOString().split('T')[0]; // Grup berdasarkan tanggal
      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          employeeName: activity.member.employee.fullname,
          dailyTotals: {},
        };
      }
      acc[employeeId].dailyTotals[dateKey] =
        (acc[employeeId].dailyTotals[dateKey] || 0) + activity.time_spent;
      return acc;
    }, {} as Record<string, { employeeId: string; employeeName: string; dailyTotals: Record<string, number> }>);
    const avgHoursData = Object.values(dailyHoursMap).map((entry) => {
      const dailyTotals = Object.values(entry.dailyTotals);
      const avgHours =
        dailyTotals.length > 0
          ? dailyTotals.reduce((sum, hours) => sum + hours, 0) /
          dailyTotals.length
          : 0;
      return {
        employeeId: entry.employeeId,
        employeeName: entry.employeeName,
        avgHours,
      };
    });

    // 4. Distribusi Aktivitas
    // Mengganti groupBy dengan in-memory aggregation
    const activityDistMap = activities.reduce((acc, activity) => {
      const employeeId = activity.member.employee.id;
      const category = activity.category;
      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          employeeName: activity.member.employee.fullname,
          categories: {},
          total: 0,
        };
      }
      acc[employeeId].categories[category] =
        (acc[employeeId].categories[category] || 0) + 1;
      acc[employeeId].total += 1;
      return acc;
    }, {} as Record<string, { employeeId: string; employeeName: string; categories: Record<string, number>; total: number }>);
    const activityData = Object.values(activityDistMap).flatMap((entry) =>
      Object.entries(entry.categories).map(([category, count]) => ({
        employeeId: entry.employeeId,
        category,
        percentage: (count / (entry.total || 1)) * 100,
      })),
    );

    // 5. Peringatan Overwork
    // Berdasarkan projectData, tidak perlu query tambahan
    const overworkAlerts = projectData.filter((p) => p.projectCount > 3);

    return {
      totalHours: hoursData,
      projectCount: projectData,
      avgDailyHours: avgHoursData,
      activityDistribution: activityData,
      overworkAlerts,
    };
  }
  // 2. Dashboard Beban Kerja Karyawan --- END

  // 3. Dashboard Produktivitas Tim --- START
  async getProductivity(
    query: ProductivityDto,
    user_id?: string | undefined,
  ): Promise<any> {
    const startDate = new Date(query.start_date);
    const endDate = new Date(query.end_date);

    // 0. Get User
    const user = await this.prisma.users.findUnique({
      where: { id: user_id },
      include: { role: true },
    });

    let whereQueries: Prisma.projectsWhereInput = {
      start_date: { gte: startDate },
      end_date: { lte: endDate },
    };

    if (query?.project_id) {
      whereQueries = {
        ...whereQueries,
        id: query.project_id,
      };
    }

    if (user && user.role.code === UserRole.PROJECT_MANAGER) {
      whereQueries = {
        ...whereQueries,
        member: {
          some: {
            employee: {
              user_id,
            },
          },
        },
      };
    }

    const projects = await this.prisma.projects.findMany({
      where: {
        ...whereQueries,
      },
      select: {
        id: true,
        status: true,
      },
    });

    // Fetch activities once for multiple metrics to optimize
    const activities = await this.prisma.activities.findMany({
      where: {
        date_at: { gte: startDate, lte: endDate },
        member: {
          project: {
            id: { in: projects.map((i) => i.id) },
          },
        },
      },
      select: {
        category: true,
        time_spent: true,
        date_at: true,
        member: {
          select: {
            project_id: true,
            project: {
              select: {
                name: true,
              },
            },
            employee: {
              select: {
                position: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    // 1. Aktivitas per Kategori
    const activityByCategory = activities.reduce((acc, activity) => {
      const category = activity.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const categoryData = Object.entries(activityByCategory).map(
      ([category, count]) => ({
        category,
        count,
      }),
    );

    // 2. Rasio Produktivitas
    const productiveCategories = ['TASK', 'BUG_FIXING'];
    const totalCount = activities.length;
    const productiveCount = activities.filter((a) =>
      productiveCategories.includes(a.category),
    ).length;
    const productivityRatio = [
      {
        type: 'Productive',
        percentage: totalCount ? (productiveCount / totalCount) * 100 : 0,
      },
      {
        type: 'Supportive',
        percentage: totalCount
          ? ((totalCount - productiveCount) / totalCount) * 100
          : 0,
      },
    ];

    // 3. Jam Kerja per Posisi
    const hoursByPosition = activities.reduce((acc, activity) => {
      const position = activity.member.employee.position.name;
      acc[position] = (acc[position] || 0) + activity.time_spent;
      return acc;
    }, {} as Record<string, number>);
    const hoursByPositionData = Object.entries(hoursByPosition).map(
      ([position, totalHours]) => ({
        position,
        totalHours,
      }),
    );

    // 4. Frekuensi Meeting
    const meetingCategories = ['MEETING_INTERNAL', 'MEETING_EXTERNAL'];
    const meetingFrequency = activities
      .filter((a) => meetingCategories.includes(a.category))
      .reduce((acc, activity) => {
        const projectId = activity.member.project_id;
        // Hitung minggu berdasarkan tanggal
        const weekStart = new Date(activity.date_at);
        weekStart.setDate(
          activity.date_at.getDate() - activity.date_at.getDay(),
        );
        const weekKey = weekStart.toISOString().split('T')[0];
        const key = `${projectId}:${weekKey}`;
        acc[key] = acc[key] || {
          projectId,
          week: weekKey,
          count: 0,
          projectName: activity.member.project.name,
        };
        acc[key].count += 1;
        return acc;
      }, {} as Record<string, { projectId: string; week: string; count: number; projectName: string }>);
    const meetingData = Object.values(meetingFrequency);

    // 5. Aktivitas per Proyek
    const activitiesPerProject = activities.reduce((acc, activity) => {
      const projectId = activity.member.project_id;
      if (!acc[projectId]) {
        acc[projectId] = {
          taskCount: 0,
          bugFixingCount: 0,
          projectName: activity.member.project.name,
        };
      }
      if (activity.category === 'TASK') {
        acc[projectId].taskCount += 1;
      } else if (activity.category === 'BUG_FIXING') {
        acc[projectId].bugFixingCount += 1;
      }
      return acc;
    }, {} as Record<string, { taskCount: number; bugFixingCount: number; projectName: string }>);
    const activitiesData = Object.entries(activitiesPerProject).map(
      ([projectId, data]) => ({
        projectId,
        projectName: data.projectName,
        taskCount: data.taskCount,
        bugFixingCount: data.bugFixingCount,
      }),
    );

    return {
      activityByCategory: categoryData,
      productivityRatio,
      hoursByPosition: hoursByPositionData,
      meetingFrequency: meetingData,
      activitiesPerProject: activitiesData,
    };
  }
  // 3. Dashboard Produktivitas Tim --- END

  // 4. Dashboard Tren Aktivitas --- START
  async getActivityTrend(
    query: ActivityTrendDto,
    user_id?: string | undefined,
  ): Promise<any> {
    const startDate = new Date(query.start_date);
    const endDate = new Date(query.end_date);

    // 0. Get User
    const user = await this.prisma.users.findUnique({
      where: { id: user_id },
      include: { role: true },
    });

    let whereQueries: Prisma.projectsWhereInput = {
      start_date: { gte: startDate },
      end_date: { lte: endDate },
    };

    if (query?.project_id) {
      whereQueries = {
        ...whereQueries,
        id: query.project_id,
      };
    }

    if (user && user.role.code === UserRole.PROJECT_MANAGER) {
      whereQueries = {
        ...whereQueries,
        member: {
          some: {
            employee: {
              user_id,
            },
          },
        },
      };
    }

    const projects = await this.prisma.projects.findMany({
      where: {
        ...whereQueries,
      },
      select: {
        id: true,
        status: true,
      },
    });

    // Fetch activities once for multiple metrics to optimize
    const activities = await this.prisma.activities.findMany({
      where: {
        date_at: { gte: startDate, lte: endDate },
        member: {
          project: {
            id: { in: projects.map((i) => i.id) },
          },
        },
      },
      select: {
        date_at: true,
        time_spent: true,
        category: true,
        member: {
          select: {
            project_id: true,
            project: {
              select: {
                name: true,
              },
            },
            employee: {
              select: {
                id: true,
                fullname: true,
              },
            },
          },
        },
      },
    });

    // Helper function to get month key (e.g., "2023-01")
    const getMonthKey = (date: Date): string => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0',
      )}`;
    };

    // Helper function to get week key (e.g., "2023-01-01")
    const getWeekKey = (date: Date): string => {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      return weekStart.toISOString().split('T')[0];
    };

    // 1. Total Jam Kerja per Bulan
    const monthlyHoursMap = activities.reduce((acc, activity) => {
      const projectId = activity.member.project_id;
      const month = getMonthKey(activity.date_at);
      const key = `${projectId}:${month}`;
      if (!acc[key]) {
        acc[key] = {
          month,
          projectId,
          totalHours: 0,
          projectName: activity.member.project.name,
        };
      }
      acc[key].totalHours += activity.time_spent;
      return acc;
    }, {} as Record<string, { month: string; projectId: string; totalHours: number; projectName: string }>);
    const monthlyHours = Object.values(monthlyHoursMap);

    // 2. Tren Kategori Aktivitas
    const categoryTrendMap = activities.reduce((acc, activity) => {
      const category = activity.category;
      const month = getMonthKey(activity.date_at);
      const key = `${month}:${category}`;
      if (!acc[key]) {
        acc[key] = { month, category, count: 0 };
      }
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { month: string; category: string; count: number }>);
    const categoryTrend = Object.values(categoryTrendMap);

    // 3. Hari Produktif
    const productiveDaysMap = activities.reduce((acc, activity) => {
      const employeeId = activity.member.employee.id;
      const dateKey = activity.date_at.toISOString().split('T')[0];
      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          employeeName: activity.member.employee.fullname,
          dailyHours: {},
        };
      }

      acc[employeeId].dailyHours[dateKey] =
        (acc[employeeId].dailyHours[dateKey] || 0) + activity.time_spent;
      return acc;
    }, {} as Record<string, { employeeId: string; employeeName: string; dailyHours: Record<string, number> }>);
    const productiveDays = Object.values(productiveDaysMap).map((entry) => {
      const productiveDaysCount = Object.values(entry.dailyHours).filter(
        (hours) => hours > 8,
      ).length;

      return {
        employeeId: entry.employeeId,
        employeeName: entry.employeeName,
        productiveDays: productiveDaysCount,
      };
    });

    // 4. Puncak Beban Kerja
    const workloadPeaksMap = activities.reduce((acc, activity) => {
      const week = getWeekKey(activity.date_at);
      if (!acc[week]) {
        acc[week] = { week, totalHours: 0 };
      }
      acc[week].totalHours += activity.time_spent;
      return acc;
    }, {} as Record<string, { week: string; totalHours: number }>);
    const workloadPeaks = Object.values(workloadPeaksMap);

    // 5. Efisiensi Aktivitas
    const efficiencyMap = activities.reduce((acc, activity) => {
      const category = activity.category;
      if (!acc[category]) {
        acc[category] = { totalHours: 0, count: 0 };
      }
      acc[category].totalHours += activity.time_spent;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { totalHours: number; count: number }>);
    const activityEfficiency = Object.entries(efficiencyMap).map(
      ([category, data]) => ({
        category,
        avgHours: data.count > 0 ? data.totalHours / data.count : 0,
      }),
    );

    return {
      monthlyHours,
      categoryTrend,
      productiveDays,
      workloadPeaks,
      activityEfficiency,
    };
  }
  // 4. Dashboard Tren Aktivitas --- END
}
