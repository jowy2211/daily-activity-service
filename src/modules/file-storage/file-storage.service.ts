import { Workbook } from 'exceljs';
import { unlinkSync } from 'fs';
import { PrismaService } from 'nestjs-prisma';
import { join } from 'path';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { activities } from '@prisma/client';

@Injectable()
export class FileStorageService {
  constructor(private readonly prismaService: PrismaService) {}

  async template() {
    try {
      return {
        file: join(process.cwd(), './storage/daily-log-template.xlsx'),
        name: 'daily-log-template.xlsx',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async import(file: Express.Multer.File) {
    try {
      const { path } = file;
      const workbook = new Workbook();

      const rawData = await workbook.xlsx.readFile(path).then(async (item) => {
        const worksheet = item.getWorksheet(1);
        const totalColumn = worksheet.columnCount;
        const totalRows = worksheet.rowCount;
        const dataRows: Partial<activities>[] = [];

        if (totalColumn !== 6 && totalColumn > 6)
          throw new HttpException(
            `File is not valid. Please download latest template.`,
            HttpStatus.BAD_REQUEST,
          );

        if (totalRows <= 1)
          throw new HttpException(
            `No data found on that file.`,
            HttpStatus.BAD_REQUEST,
          );

        for (let index = 2; index <= totalRows; index++) {
          // const item = worksheet.getRow(index);
          // Spesific value
          // Push data here
        }

        return dataRows;
      });

      return await this.prismaService
        .$transaction(async (tx) => {
          return await tx.activities.createMany({
            data: rawData as activities[],
            skipDuplicates: true,
          });
        })
        .then((resCreate) => {
          return resCreate.count;
        })
        .catch((error) => {
          throw new BadRequestException(error);
        })
        .finally(() => {
          unlinkSync(path);
        });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
