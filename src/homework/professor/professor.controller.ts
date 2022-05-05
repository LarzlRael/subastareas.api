import { Controller, Post, UseGuards } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from '../../auth/decorators/get-user..decorator';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('professor')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProfessorController {
  constructor(private professorService: ProfessorService) {}

  @Post('/becomeProfessor')
  becomeProfessor(@GetUser() user: User) {
    return this.professorService.becomeProfessor(user);
  }
}
