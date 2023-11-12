import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupBody {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export interface ReqUser {
  userId: string;
  email: string;
}
