import { IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'Username is required' })
  readonly username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  readonly password: string;
}
