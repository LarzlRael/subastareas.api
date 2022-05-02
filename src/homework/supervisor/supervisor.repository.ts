/* eslint-disable prettier/prettier */
import {
    InternalServerErrorException,
} from '@nestjs/common';

import { EntityRepository, Repository } from 'typeorm';


import { Supervisor } from './entities/Supervisor.entity';
import { User } from '../../auth/entities/user.entity';

@EntityRepository(Supervisor)
export class SupervisorRepository extends Repository<Supervisor> {

    async createSupervisor(user: User) {
        
        const createNewSupervisor = this.create({ user })
        return await this.save(createNewSupervisor);
    }
}
