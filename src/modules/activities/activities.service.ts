import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'nestjs-prisma';
import { ParamsTableDto } from 'src/utils';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(payload: CreateActivityDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const code = `LOG${Date.now()}`;

        return tx.activities.createMany({
          data: [
            {
              code,
              member_id: payload.member_id,
              date: new Date(payload.date),
              category: payload.category,
              description: payload.description,
              time_spent: payload.time_spent,
              note: payload.note,
            },
          ],
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(params: ParamsTableDto) {
    try {
      return await this.prismaService.activities.findMany();
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
          date: true,
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
        where: { code, deleted_at: null },
        select: { id: true },
      });

      if (!detail) throw new NotFoundException('Daily Log is not found');

      await this.prismaService.activities.update({
        where: { id: detail.id },
        data: { deleted_at: new Date() },
      });
    } catch (error) {
      throw error;
    }
  }
}
