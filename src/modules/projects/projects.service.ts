import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { members, Prisma, ProjectStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ParamsTableDto } from 'src/utils';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  UpdateProjectDto,
  UpdateStatusProjectDto,
} from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(payload: CreateProjectDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const { member, ...project } = payload;
        const codeProject = `SYND${Date.now()}`;

        const res = await tx.projects.create({
          data: { ...project, code: codeProject },
        });

        const addMember = await tx.members.createMany({
          data: member.map((item) => {
            return {
              project_id: res.id,
              employee_id: item.employee_id,
              responsibility: item.responsibility,
              description: item.description,
              is_active: item.is_active,
              is_captain: [
                'PROJECT_LEAD',
                'PRODUCT_OWNER',
                'TECH_LEAD',
              ].includes(item.responsibility),
            };
          }),
        });

        return {
          ...res,
          members: addMember,
        };
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(params: ParamsTableDto) {
    try {
      let where: Prisma.projectsWhereInput = {};

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
              {
                name: {
                  contains: params.search,
                },
              },
            ],
          },
        };
      }

      return this.prismaService.projects.findMany({
        where,
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          start_date: true,
          end_date: true,
          status: true,
          created_at: true,
          _count: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findMany(user_id: string, params: ParamsTableDto) {
    try {
      let where: Prisma.projectsWhereInput = {
        member: {
          some: {
            employee: {
              user_id,
            },
          },
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
              {
                name: {
                  contains: params.search,
                },
              },
            ],
          },
        };
      }

      return this.prismaService.projects.findMany({
        where,
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          start_date: true,
          end_date: true,
          status: true,
          created_at: true,
          _count: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findManyLogs(code: string, user_id: string) {
    try {
      const detail = await this.prismaService.projects.findUnique({
        where: { code },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          start_date: true,
          end_date: true,
          status: true,
          member: {
            where: { employee: { user_id }, is_active: true },
            select: {
              id: true,
              responsibility: true,
              description: true,
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
              activities: {
                orderBy: {
                  created_at: 'desc',
                },
              },
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

  async findOne(code: string, user_id: string) {
    try {
      const detail = await this.prismaService.projects.findUnique({
        where: { code },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          start_date: true,
          end_date: true,
          status: true,
          created_at: true,
          member: {
            select: {
              id: true,
              responsibility: true,
              description: true,
              is_active: true,
              is_captain: true,
              employee_id: true,
              employee: {
                select: {
                  id: true,
                  code: true,
                  fullname: true,
                  email: true,
                  position: {
                    select: {
                      code: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!detail) throw new NotFoundException('Project is not found');

      const memberLoggedIn = await this.prismaService.members.findFirst({
        where: { employee: { user_id }, project_id: detail.id },
        select: {
          id: true,
          responsibility: true,
          is_active: true,
          is_captain: true,
        },
      });

      return { ...detail, viewer: memberLoggedIn };
    } catch (error) {
      throw error;
    }
  }

  async update(code: string, payload: UpdateProjectDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const { member, ...project } = payload;
        const detail = await tx.projects.findUnique({
          where: { code },
        });

        if (!detail) throw new NotFoundException('Project is not found');

        await tx.projects.update({
          where: { code },
          data: {
            ...project,
          },
        });

        for (let index = 0; index < member.length; index++) {
          const item: Partial<members> = member[index];

          if (item?.id) {
            await tx.members.update({
              where: { id: item.id },
              data: { ...item },
            });
          } else {
            await tx.members.create({
              data: {
                employee: {
                  connect: {
                    id: item.employee_id,
                  },
                },
                project: {
                  connect: {
                    id: detail.id,
                  },
                },
                responsibility: item.responsibility,
                description: item.description,
                is_active: item.is_active,
              },
            });
          }
        }

        return detail;
      });
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(code: string, payload: UpdateStatusProjectDto) {
    try {
      const detail = await this.prismaService.projects.findUnique({
        where: { code },
      });

      if (!detail) throw new BadRequestException('Project is not found');

      return await this.prismaService.projects.update({
        where: { code },
        data: { status: payload.status },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          start_date: true,
          end_date: true,
          status: true,
          created_at: true,
          member: {
            select: {
              id: true,
              responsibility: true,
              description: true,
              is_active: true,
              is_captain: true,
              employee_id: true,
              employee: {
                select: {
                  id: true,
                  code: true,
                  fullname: true,
                  email: true,
                  position: {
                    select: {
                      code: true,
                      name: true,
                    },
                  },
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

  async remove(id: string) {
    try {
      const detail = await this.prismaService.projects.findUnique({
        where: { id },
      });

      if (!detail) throw new NotFoundException('Project is not found');

      await this.prismaService.projects.update({
        where: { id },
        data: {
          status: ProjectStatus.DISCONTINUED,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
