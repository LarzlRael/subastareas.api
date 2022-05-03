import { HomeWorkStatusEnum } from '../../../enums/rol.enum';
export class ActionSupervisorDTO {
  observation: string;
  status: HomeWorkStatusEnum;
  idHomework: number;
}
