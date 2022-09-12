import { IsNotEmpty } from 'class-validator';
import { AuthCredentialDTO } from '../../auth/dto/AuthCredentialDTO ';


export class CommentDto {
  @IsNotEmpty()
  content: string;

  /* user?: AuthCredentialDTO; */
}
