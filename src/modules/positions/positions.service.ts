import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PrismaService } from 'nestjs-prisma';
import { ParamsTableDto } from 'src/utils';

@Injectable()
export class PositionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(payload: CreatePositionDto) {
    try {
      const positionCode = `POS${Date.now()}`;

      return await this.prismaService.positions.create({
        data: { ...payload, code: positionCode },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(params: ParamsTableDto) {
    try {
      return await this.prismaService.positions
        .findMany({
          where: { deleted_at: null },
        })
        .then((res) =>
          res.map((item) => ({
            text: `${item.code} - ${item.name}`,
            value: item.id,
          })),
        );
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const detail = await this.prismaService.positions.findUnique({
        where: { id, deleted_at: null },
      });

      if (!detail) throw new NotFoundException('Position is not found');

      return detail;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, payload: UpdatePositionDto) {
    try {
      const detail = await this.prismaService.positions.findUnique({
        where: { id, deleted_at: null },
      });

      if (!detail) throw new NotFoundException('Position is not found');

      return await this.prismaService.positions.update({
        where: { id, deleted_at: null },
        data: { ...payload },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const detail = await this.prismaService.positions.findUnique({
        where: { id, deleted_at: null },
      });

      if (!detail) throw new NotFoundException('Position is not found');

      return await this.prismaService.positions.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
    } catch (error) {
      throw error;
    }
  }
}
