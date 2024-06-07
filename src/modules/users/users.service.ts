import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { users } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(payload: CreateUserDto) {
    try {
      const hashPassword = await hash(payload.password, 10);

      return await this.prismaService.users.create({
        data: { ...payload, password: hashPassword },
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
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: any): Promise<users[]> {
    try {
      const result = await this.prismaService.users.findMany();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const detail = await this.prismaService.users.findUnique({
        where: { id, deleted_at: null },
        select: {
          id: true,
          role_id: true,
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

      if (!detail) throw new NotFoundException('User is not found.');

      return detail;
    } catch (error) {
      throw error;
    }
  }

  update(id: string, payload: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
