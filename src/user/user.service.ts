import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupBody } from './user.model';
import { hash } from 'bcrypt';
import { Res } from '../common/interface';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async signup(body: SignupBody): Promise<Res<User>> {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (user) throw new BadRequestException('email already registered');

    body.password = await hash(body.password, 10);
    const result = await this.prismaService.user.create({ data: body });

    delete result.password;
    return { ok: true, message: 'signed up', data: result };
  }

  async getProfileById(userId: string): Promise<Res<User>> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    delete user.password;
    return { ok: true, message: 'get profile success', data: user };
  }
}
