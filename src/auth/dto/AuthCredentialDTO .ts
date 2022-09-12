import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

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

  idDevice?: string;

  @IsOptional()
  @IsEmail()
  email: string;
}
export class RegisterUserDTO {
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

  @IsEmail()
  email: string;
}
