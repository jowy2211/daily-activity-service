import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class FileStorageService {
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
}
