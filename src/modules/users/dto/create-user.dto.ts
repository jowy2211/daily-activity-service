import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required.' })
  readonly username: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Passoword length must be at least 8 characters' })
  readonly password: string;

  @IsNotEmpty({ message: 'Role is required.' })
  readonly role_id: string;
}
