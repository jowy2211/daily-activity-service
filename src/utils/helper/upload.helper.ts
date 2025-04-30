import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

import { NotAcceptableException } from '@nestjs/common';

export const CheckDir = (path: string) => {
  const stat = existsSync(path);

  if (!stat) return false;

  return true;
};

export const DestinationFileExcel = async (req, res, callback) => {
  const existDir = CheckDir(`/storage/import`);
  if (existDir) {
    return callback(null, `./storage/import`);
  } else {
    mkdirSync(`./storage/import`, {
      recursive: true,
    });
    return callback(null, `./storage/import`);
  }
};

export const FilterFileExcel = async (req, file, callback) => {
  if (
    file.mimetype.match(
      /\/(vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel)$/,
    )
  ) {
    callback(null, true);
  } else {
    callback(new NotAcceptableException('Extension not Support.'), false);
  }
};

export const FileNameFile = async (req, file, callback) => {
  const date_random = Date.now() + Math.round(Math.random() * 1e9);
  const ext = extname(file.originalname);
  const name = file.originalname
    .toString()
    .replace(/\s+/g, '')
    .trim()
    .substring(0, 3);
  const file_name = `${date_random}-${name
    .toUpperCase()
    .replace(/\s+/g, '')}${ext}`;
  callback(null, file_name);
};
