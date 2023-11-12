import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ReqUser, SignupBody } from './user.model';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() body: SignupBody) {
    return this.userService.signup(body);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@User() user: ReqUser) {
    return this.userService.getProfileById(user.userId);
  }
}
