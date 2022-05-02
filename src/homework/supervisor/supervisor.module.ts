import { Module } from '@nestjs/common';
import { SupervisorController } from './supervisor.controller';
import { SupervisorService } from './supervisor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupervisorRepository } from './supervisor.repository';
import { RolsModule } from '../../auth/rols/rols.module';
import { RolRepository } from '../../auth/rols/entities/rol.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupervisorRepository, RolRepository]),
    RolsModule,
    SupervisorModule,
  ],
  controllers: [SupervisorController],
  providers: [SupervisorService],
})
export class SupervisorModule {}
