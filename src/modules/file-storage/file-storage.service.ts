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
import { activities, ActivityCategory } from '@prisma/client';

import { ImportActivityMemberDto } from './dto/file-storage.dto';

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

  async import(file: Express.Multer.File, query: ImportActivityMemberDto) {
    try {
      const { path } = file;
      const workbook = new Workbook();

      const rawData = await workbook.xlsx.readFile(path).then(async (item) => {
        const worksheet = item.getWorksheet(1);
        const totalColumn = worksheet.columnCount;
        const totalRows = worksheet.rowCount;
        const dataRows: Partial<activities>[] = [];

        console.log('totalColumn : ', totalColumn);
        console.log('totalRows : ', totalRows);

        if (totalColumn !== 7 && totalColumn > 7)
          throw new HttpException(
            `File is not valid. Please download latest template.`,
            HttpStatus.BAD_REQUEST,
          );

        if (totalRows <= 2)
          throw new HttpException(
            `No data found on that file.`,
            HttpStatus.BAD_REQUEST,
          );

        // Index = 3 is first data at row 3
        for (let index = 3; index <= totalRows; index++) {
          const item = worksheet.getRow(index);

          if (item) {
            dataRows.push({
              member_id: query.member_id,
              code: `LOG${Date.now() + index}`,
              // Transform Raw Data Type to Specific Defined Type Data
              date_at: new Date(item.getCell(1).value as Date), // As Date
              description: item.getCell(2).value as string, // As String
              category: item.getCell(3).value as ActivityCategory, // As Enum Activity Category
              time_spent: parseFloat(item.getCell(4).value as string), // As Float/Decimal
              note: item.getCell(5).value as string, // As String
            });
          }
        }

        console.log('row data : ', dataRows);
        return dataRows;
      });

      return await this.prismaService
        .$transaction(async (tx) => {
          // Transformed Data is Load to database
          return await tx.activities.createMany({
            data: rawData as activities[],
            skipDuplicates: true,
          });
        })
        .then((resCreate) => {
          console.log('res create many : ', resCreate);
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
