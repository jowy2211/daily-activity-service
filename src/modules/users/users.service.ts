import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { ParamsTableDto } from 'src/utils';
import { UserRole } from 'src/utils/helper/enum.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(payload: CreateUserDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const { employees, ...user } = payload;
        const checkUser = await tx.users.findUnique({
          where: { username: payload.username },
        });

        if (checkUser)
          throw new BadRequestException(
            'User already registered. Duplicate user',
          );

        const hashPassword = await hash(user.password, 10);
        const employeeCode = `EMP${Date.now()}`;

        return await tx.users.create({
          data: {
            username: user.username,
            password: hashPassword,
            role_id: user.role_id,
            employees: {
              create: {
                code: employeeCode,
                fullname: employees.fullname,
                email: employees.email,
                address: employees.address,
                phone_number: employees.phone_number,
                position_id: employees.position_id,
              },
            },
          },
          select: {
            id: true,
            username: true,
            status: true,
            role: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: ParamsTableDto, user_id: string): Promise<any[]> {
    try {
      return await this.prismaService.users.findMany({
        where: { id: { not: user_id } },
        select: {
          id: true,
          created_at: true,
          updated_at: true,
          employees: {
            select: {
              code: true,
              fullname: true,
              email: true,
              phone_number: true,
              position: {
                select: {
                  code: true,
                  name: true,
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
      const employee = await this.prismaService.employees.findUnique({
        where: { code },
      });

      if (!employee) throw new NotFoundException('User is not found.');

      return await this.prismaService.users.findUnique({
        where: { id: employee.user_id },
        select: {
          role_id: true,
          username: true,
          employees: {
            select: {
              fullname: true,
              email: true,
              phone_number: true,
              address: true,
              position_id: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(code: string, payload: UpdateUserDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const checkEmployee = await tx.employees.findUnique({
          where: { code },
        });

        if (!checkEmployee) throw new NotFoundException('User is not found');

        let updatePassword = {};

        if (payload?.password) {
          const hashPassword = await hash(payload.password, 10);

          updatePassword = {
            password: hashPassword,
          };
        }

        return await tx.users.update({
          where: { id: checkEmployee.user_id },
          data: {
            ...updatePassword,
            employees: {
              update: {
                fullname: payload.fullname,
                email: payload.email,
                address: payload.address,
                phone_number: payload.phone_number,
                position_id: payload.position_id,
              },
            },
          },
          include: { employees: true },
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const checkUser = await tx.users.findUnique({
          where: { id },
        });

        if (!checkUser) throw new NotFoundException('User is not found');

        return await tx.users.update({
          where: { id },
          data: {
            employees: {
              update: {
                is_active: false,
              },
            },
          },
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // Employee
  async findAllEmployee(user_id: string, code: string) {
    try {
      return await this.prismaService.employees
        .findMany({
          where: {
            member: {
              every: {
                project: {
                  code: {
                    not: code,
                  },
                },
              },
            },
            user: {
              role: {
                code: {
                  not: {
                    in: [UserRole.ADMIN, UserRole.PROJECT_MANAGER],
                  },
                },
              },
            },
            user_id: {
              not: user_id,
            },
            is_active: true,
          },
          select: {
            id: true,
            fullname: true,
            position: {
              select: {
                code: true,
                name: true,
              },
            },
          },
          orderBy: {
            position: {
              code: 'asc',
            },
          },
        })
        .then((res) => {
          return res.map((item) => ({
            text: `${item.fullname} [${item.position.name}]`,
            value: item.id,
          }));
        });
    } catch (error) {
      throw error;
    }
  }
}
