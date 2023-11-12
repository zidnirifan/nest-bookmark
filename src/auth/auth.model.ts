import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninBody {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
