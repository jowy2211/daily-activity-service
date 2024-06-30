import { MemberResponsibility, ProjectStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

class MemberDto {
  @IsNotEmpty()
  readonly employee_id: string;

  @IsNotEmpty()
  @IsEnum(MemberResponsibility)
  readonly responsibility: MemberResponsibility;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_active: boolean = true;
}

export class CreateProjectDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @Transform((params) => params.value || null)
  @IsOptional()
  readonly start_date: string;

  @Transform((params) => params.value || null)
  @IsOptional()
  readonly end_date: string;

  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  readonly status: ProjectStatus = ProjectStatus.CREATED;

  @Transform((params) => params.value || [])
  @IsOptional()
  @IsArray()
  @Type(() => MemberDto)
  readonly member?: MemberDto[];
}
