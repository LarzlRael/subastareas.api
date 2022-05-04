import { Module } from '@nestjs/common';
import { SupervisorController } from './supervisor.controller';
import { SupervisorService } from './supervisor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupervisorRepository } from './supervisor.repository';
import { RolsModule } from '../../auth/rols/rols.module';
import { RolRepository } from '../../auth/rols/entities/rol.repository';
import { HomeworkRepository } from '../homework.repository';
import { WalletRepository } from '../../wallet/wallet.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupervisorRepository,
      RolRepository,
      HomeworkRepository,
    ]),
    RolsModule,
    SupervisorModule,
  ],
  controllers: [SupervisorController],
  providers: [SupervisorService],
})
export class SupervisorModule {}
