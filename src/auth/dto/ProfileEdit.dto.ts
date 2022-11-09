import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProfileEditDto {
  profileImageUrl?: string;
  name?: string;
  lastName?: string;

  nickName?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
