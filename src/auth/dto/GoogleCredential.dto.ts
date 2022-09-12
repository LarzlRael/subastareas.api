import { IsString, MinLength } from 'class-validator';

export class GoogleCredentialDto {
  @IsString()
  @MinLength(6)
  googleToken: string;
  idDevice: string;
}
