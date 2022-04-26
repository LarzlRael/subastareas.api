import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuthCredentialDTO } from '../../auth/dto/AuthCredentialDTO ';

export class HomeworkDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  offered_amount: number;
  fileUrl?: string;
  resolutionTime?: Date;
  category?: string;
}
