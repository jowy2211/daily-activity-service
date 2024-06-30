import { IsOptional } from 'class-validator';

export class ParamsTableDto {
  @IsOptional()
  readonly page?: number = 1;

  @IsOptional()
  readonly per_page?: number = 10;

  @IsOptional()
  readonly search?: string;
}
