import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { employees, UserStatus } from '@prisma/client';
import { compare } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { AuthDto } from './dto/auth.dto';

interface User {
  username: string;
  password: string;
  role: Role;
  employees: employees | null;
}

interface Role {
  code: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async _validate(username: string, password: string): Promise<User | any> {
    const getDetail = await this.prismaService.users.findUnique({
      where: { username },
      select: {
        username: true,
        password: true,
        employees: {
          select: {
            fullname: true,
            email: true,
            phone_number: true,
          },
        },
        role: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    if (!getDetail) throw new NotFoundException('User is not found');

    const checkPassword = await compare(password, getDetail.password);

    console.log(checkPassword);

    if (!checkPassword) throw new UnauthorizedException('Password is invalid');

    return getDetail;
  }

  async login(payload: AuthDto) {
    try {
      const res: User | any = await this._validate(
        payload.username,
        payload.password,
      );

      if (!res)
        throw new BadRequestException('Cannot process your log in request');

      await this.prismaService.users.update({
        where: { username: res.username },
        data: {
          status: UserStatus.ONLINE,
        },
      });

      return {
        access_token: await this.jwtService.signAsync({
          username: res.username,
          fullname: res.employees?.fullname,
        }),
        expires_in: process.env.JWT_EXPIRES_IN,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(user: any) {
    try {
      const detail = await this.prismaService.users.findUnique({
        where: { id: user?.id },
      });

      if (!detail) throw new ForbiddenException();

      return await this.prismaService.users.update({
        where: { id: user?.id },
        data: { status: UserStatus.OFFLINE },
      });
    } catch (error) {
      throw error;
    }
  }

  async detail(user: any) {
    return await this.prismaService.users.findFirst({
      where: {
        id: user?.id,
      },
      select: {
        id: true,
        username: true,
        status: true,
        role: {
          select: {
            code: true,
            name: true,
          },
        },
        employees: {
          select: {
            code: true,
            fullname: true,
            email: true,
            phone_number: true,
            address: true,
            position: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
