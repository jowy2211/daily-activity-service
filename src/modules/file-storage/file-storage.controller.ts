import {
  BadRequestException,
  Controller,
  Get,
  Header,
  HttpCode,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, unlinkSync } from 'fs';
import { FileStorageService } from './file-storage.service';

@Controller('file-storage')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) { }

  @HttpCode(200)
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
}
