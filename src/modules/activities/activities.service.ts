import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ParamsTableDto } from 'src/utils';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(payload: CreateActivityDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const code = `LOG${Date.now()}`;

        return tx.activities.createMany({
          data: payload.logs.map((item) => ({
            code,
            member_id: item.member_id,
            date_at: new Date(item.date),
            category: item.category,
            description: item.description,
            time_spent: item.time_spent,
            note: item.note,
          })),
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(params: ParamsTableDto, member_id: string) {
    try {
      return await this.prismaService.activities.findMany({
        where: { member_id },
        select: {
          code: true,
          date_at: true,
          description: true,
          note: true,
          category: true,
          time_spent: true,
          member: {
            select: {
              id: true,
              responsibility: true,
              description: true,
              project: {
                select: {
                  code: true,
                  name: true,
                  status: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findMany(params: ParamsTableDto, user_id: string) {
    try {
      let where: Prisma.activitiesWhereInput = {
        member: {
          employee: { user_id },
        },
      };

      if (params.search) {
        where = {
          ...where,
          AND: {
            OR: [
              {
                code: {
                  contains: params.search,
                },
              },
            ],
          },
        };
      }

      return await this.prismaService.activities.findMany({
        where,
        orderBy: { date_at: 'desc' },
        select: {
          code: true,
          date_at: true,
          description: true,
          note: true,
          category: true,
          time_spent: true,
          member: {
            select: {
              id: true,
              responsibility: true,
              description: true,
              project: {
                select: {
                  code: true,
                  name: true,
                  status: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(code: string) {
    try {
      const detail = await this.prismaService.activities.findUnique({
        where: { code },
        select: {
          id: true,
          code: true,
          date_at: true,
          category: true,
          description: true,
          time_spent: true,
          note: true,
          member: {
            select: {
              employee: {
                select: {
                  code: true,
                  fullname: true,
                  position: {
                    select: {
                      code: true,
                      name: true,
                    },
                  },
                },
              },
              project: {
                select: {
                  code: true,
                  name: true,
                  description: true,
                  start_date: true,
                  end_date: true,
                  status: true,
                },
              },
              responsibility: true,
              description: true,
            },
          },
        },
      });

      if (!detail) throw new NotFoundException('Project is not found');

      return detail;
    } catch (error) {
      throw error;
    }
  }

  async update(code: string, payload: UpdateActivityDto) {
    try {
      return await this.prismaService.activities.findMany();
    } catch (error) {
      throw error;
    }
  }

  async remove(code: string) {
    try {
      const detail = await this.prismaService.activities.findUnique({
        where: { code },
        select: { id: true },
      });

      if (!detail) throw new NotFoundException('Daily Log is not found');

      await this.prismaService.activities.update({
        where: { id: detail.id },
        data: { updated_at: new Date() },
      });
    } catch (error) {
      throw error;
    }
  }
}
