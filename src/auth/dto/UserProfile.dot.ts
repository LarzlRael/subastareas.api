import { IsBoolean, IsEmail, IsNumber } from 'class-validator';

export class UserProfileDTO {
  @IsNumber()
  id: number;

  @IsBoolean()
  isDarkTheme: boolean;

  @IsBoolean()
  notifications: boolean;

  biography: string;
}
