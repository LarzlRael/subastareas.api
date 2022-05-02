import { Module } from '@nestjs/common';
import { RolsService } from './rols.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RolRepository } from './entities/rol.repository';

import { RolsController } from './rols.controller';
import { UsersRepository } from '../user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RolRepository, UsersRepository])],
  providers: [RolsService],
  controllers: [RolsController],
})
export class RolsModule { }
