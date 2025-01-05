import { IsArray, IsNotEmpty } from 'class-validator';
import { ActivityDto } from './activity.dto';
import { Type } from 'class-transformer';

export class CreateActivityDto {
  @IsNotEmpty()
  @IsArray()
  @Type(() => ActivityDto)
  readonly logs: ActivityDto[];
}
