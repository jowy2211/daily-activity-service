import { Response } from 'express';
import { createReadStream, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ResponseInterceptor } from 'src/utils';
import {
  DestinationFileExcel,
  FileNameFile,
  FilterFileExcel,
} from 'src/utils/helper/upload.helper';

import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  ExportActivityMemberDto,
  ImportActivityMemberDto,
} from './dto/file-storage.dto';
import { FileStorageService } from './file-storage.service';

@Controller('file-storage')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @HttpCode(HttpStatus.OK)
  @Get('template')
  async template(
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    try {
      const data = {
        file: join(process.cwd(), './storage/daily-log-template.xlsx'),
        name: 'daily-log-template.xlsx',
      };

      const file = createReadStream(data.file);

      res.set({
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': `attachment; filename=${data.name}`,
      });

      return new StreamableFile(file, {
        type: 'application/vnd.ms-excel',
        disposition: `attachment; filename=${data.name}`,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: DestinationFileExcel,
        filename: FileNameFile,
      }),
      fileFilter: FilterFileExcel,
      limits: {
        fileSize: 100000,
      },
    }),
    ResponseInterceptor,
  )
  async importDailyLog(
    @UploadedFile() file: Express.Multer.File,
    @Query() query: ImportActivityMemberDto,
  ) {
    try {
      if (file) {
        return await this.fileStorageService.import(file, query);
      }
      throw new BadRequestException('Something went wrong. Try again later.');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('export')
  async exportDailyLog(
    @Res({ passthrough: true }) res: Response,
    @Query() query: ExportActivityMemberDto,
  ): Promise<StreamableFile> {
    try {
      const data = await this.fileStorageService.export(query);
      const file = createReadStream(data.file);

      // After download, file will removed
      file.on('end', () => {
        try {
          unlinkSync(data.file);
        } catch (error) {
          throw new BadRequestException(
            'An error occurred while removing the file.',
          );
        }
      });
      res.set({
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': `attachment; filename=${data.fileName}`,
      });

      return new StreamableFile(file);
    } catch (error) {
      throw error;
    }
  }
}
