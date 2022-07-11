import { Repository, EntityRepository } from 'typeorm';
import { Homework } from './entities/Homework.entity';

@EntityRepository(Homework)
export class HomeworkRepository extends Repository<Homework> {}
