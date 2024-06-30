import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { MemberResponsibility } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';

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
