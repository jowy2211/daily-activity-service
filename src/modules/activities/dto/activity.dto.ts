import { ActivityCategory } from '@prisma/client';
import { IsNotEmpty, IsEnum, IsDecimal, IsOptional } from 'class-validator';

export class ActivityDto {
  @IsNotEmpty()
  readonly member_id: string;

  @IsNotEmpty()
  readonly date: string;

  @IsEnum(ActivityCategory)
  @IsNotEmpty()
  readonly category: ActivityCategory;

  @IsNotEmpty()
  readonly description: string;

  @IsDecimal()
  readonly time_spent: number;

  @IsOptional()
  readonly note?: string;
}
