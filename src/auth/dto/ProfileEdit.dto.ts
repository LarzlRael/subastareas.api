import { IsEmail, IsNumber } from 'class-validator';

export class ProfileEditDto {
  profileImageUrl?: string;
  name?: string;
  lastName?: string;

  nickName?: string;

  @IsEmail()
  email?: string;

  @IsNumber()
  phone?: number;
}
