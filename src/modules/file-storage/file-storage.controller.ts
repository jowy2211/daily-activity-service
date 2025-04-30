import { Response } from 'express';
import { createReadStream, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
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
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileStorageService } from './file-storage.service';

@Controller('file-storage')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.ms-excel')
  @Get('template')
  async template(
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    try {
      const data = await this.fileStorageService.template();
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
        'Content-Disposition': `attachment; filename=${data.name}`,
      });

      return new StreamableFile(file);
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
  async importDailyLog(@UploadedFile() file: Express.Multer.File) {
    try {
      if (file) {
        return await this.fileStorageService.import(file);
      }
      throw new BadRequestException('Something went wrong. Try again later.');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
