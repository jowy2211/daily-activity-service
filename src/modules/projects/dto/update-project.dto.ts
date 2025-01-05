import { PartialType } from '@nestjs/mapped-types';
import { MemberResponsibility, ProjectStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

class UpsertMemberDto {
  @Transform((params) => params.value || null)
  @IsOptional()
  readonly id: string;

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

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsNotEmpty({ each: true })
  @IsArray()
  @Type(() => UpsertMemberDto)
  readonly member: UpsertMemberDto[];
}

export class UpdateStatusProjectDto {
  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  readonly status: ProjectStatus;
}
