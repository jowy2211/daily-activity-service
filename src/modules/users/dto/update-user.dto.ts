import { IsEmail, IsMobilePhone, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @Transform((params) => params.value || null)
  @IsOptional()
  readonly username?: string;

  @Transform((params) => params.value || null)
  @IsOptional()
  readonly password?: string;

  @Transform((params) => params.value || null)
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @Transform((params) => params.value || null)
  @IsOptional()
  readonly fullname?: string;

  @Transform((params) => params.value || null)
  @IsOptional()
  readonly address?: string;

  @Transform((params) => params.value || null)
  @IsOptional()
  @IsMobilePhone('id-ID')
  readonly phone_number?: string;

  @Transform((params) => params.value || null)
  @IsOptional()
  readonly position_id?: string;
}
