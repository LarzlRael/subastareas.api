import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDTO {
  id?: number;

  @IsString()
  @MinLength(6)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  /* @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password_weak',
  }) */
  password: string;

  profileImageUrl?: string;
  google?: boolean;
  name?: string;
  lastName?: string;
  email?: string;
  nickName?: string;
  phone?: string;
  verify?: boolean;
}
