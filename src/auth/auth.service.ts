import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SigninBody } from './auth.model';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Res } from '../common/interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signin(body: SigninBody): Promise<Res<{ accessToken: string }>> {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      throw new NotFoundException('email not found');
    }

    const isMatch = await compare(body.password, user.password);
    if (!isMatch) throw new ForbiddenException('wrong password');

    const accessToken = await this.jwtService.signAsync({
      userId: user.id,
      email: user.email,
    });

    return { ok: true, message: 'login successfully', data: { accessToken } };
  }
}
