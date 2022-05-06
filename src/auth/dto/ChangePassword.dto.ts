import { IsString, MinLength, MaxLength } from 'class-validator';
import { Match } from 'test/decorators/math.decorator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(32)

  /* @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password_weak',
  }) */
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password')
  passwordConfirm: string;
}
