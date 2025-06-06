import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ImportActivityMemberDto {
  @IsString()
  @IsNotEmpty()
  readonly member_id: string;
}

export class ExportActivityMemberDto {
  @IsString()
  @IsNotEmpty()
  readonly employee_id: string;

  @IsString()
  @IsOptional()
  readonly project_id?: string;
}
