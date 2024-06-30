import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class EmployeeDto {
  @IsNotEmpty()
  readonly position_id: string;

  @IsNotEmpty()
  readonly fullname: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Transform((params) => params.value || null)
  @IsOptional()
  @IsMobilePhone('id-ID')
  readonly phone_number?: string;

  @Transform((params) => params.value || null)
  @IsOptional()
  readonly address?: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required.' })
  readonly username: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Passoword length must be at least 8 characters' })
  readonly password: string;

  @IsNotEmpty({ message: 'Role is required.' })
  readonly role_id: string;

  @IsNotEmpty()
  @Type(() => EmployeeDto)
  readonly employees: EmployeeDto;
}
