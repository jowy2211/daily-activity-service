import { Workbook } from 'exceljs';
import { mkdirSync, unlinkSync } from 'fs';
import { PrismaService } from 'nestjs-prisma';
import { join } from 'path';
import { CheckDir } from 'src/utils/helper/upload.helper';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { activities, ActivityCategory, Prisma } from '@prisma/client';

import {
  ExportActivityMemberDto,
  ImportActivityMemberDto,
} from './dto/file-storage.dto';

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

  async export(query: ExportActivityMemberDto) {
    try {
      const employee = await this.prismaService.employees.findUnique({
        where: { id: query.employee_id },
        select: {
          fullname: true,
        },
      });
      let where: Prisma.activitiesWhereInput = {
        member: {
          employee_id: query.employee_id,
        },
      };

      if (query.project_id) {
        where = {
          member: {
            employee_id: query.employee_id,
            project_id: query.project_id,
          },
        };
      }

      const activity = await this.prismaService.activities.findMany({
        where,
        orderBy: { date_at: 'asc' },
      });

      const fileName = `${employee.fullname}-${
        query.project_id
      }-activity-data-${Date.now()}.xlsx`;
      const workbook = new Workbook();

      const worksheet = await workbook.addWorksheet(`Activities Data`);
      worksheet.columns = [
        {
          header: 'Date',
          key: 'date_at',
          width: 25,
          font: { bold: true, size: 14 },
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
        {
          header: "What you've done today ?",
          key: 'description',
          width: 50,
          font: { bold: true, size: 14 },
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
        {
          header: 'Activity',
          key: 'category',
          width: 25,
          font: { bold: true, size: 14 },
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
        {
          header: 'Duration',
          key: 'time_spent',
          width: 25,
          font: { bold: true, size: 14 },
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
        {
          header: 'Any issue or note you want to share ?',
          key: 'note',
          width: 25,
          font: { bold: true, size: 14 },
          alignment: { vertical: 'middle', horizontal: 'center' },
        },
      ];

      const rows = [];

      for (let idxAct = 0; idxAct < activity.length; idxAct++) {
        const act = activity[idxAct];

        rows.push({
          date_at: act.date_at,
          description: act.description,
          category: act.category,
          time_spent: act.time_spent,
          note: act.note,
        });
      }

      worksheet.addRows(rows);

      const check = CheckDir(`./storage/export`);

      if (!check) mkdirSync(`./storage/export`, { recursive: true });

      const filePromise = workbook.xlsx
        .writeFile(`./storage/export/${fileName}`)
        .then(() => {
          return `./storage/export/${fileName}`;
        });

      const file = await filePromise.finally();

      return { file, fileName };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
