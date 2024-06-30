import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    try {
      return await this.prismaService.roles.findMany().then((res) =>
        res.map((item) => ({
          text: `${item.code} - ${item.name}`,
          value: item.id,
        })),
      );
    } catch (error) {
      throw error;
    }
  }
}
