import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePositionDto {
  @IsNotEmpty()
  readonly name: string;

  @Transform((params) => params.value || null)
  @IsOptional()
  readonly description?: string;
}
