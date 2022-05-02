import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ProfileEditDto {
  profileImageUrl?: string;
  name?: string;
  lastName?: string;
  email?: string;
  nickName?: string;
  phone?: string;
}
