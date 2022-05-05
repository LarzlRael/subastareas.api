import { EntityRepository, Repository } from 'typeorm';
import { SuperviseHomeWork } from './entities/superviseHomework..entity';

@EntityRepository(SuperviseHomeWork)
export class CommentRepository extends Repository<SuperviseHomeWork> {}
