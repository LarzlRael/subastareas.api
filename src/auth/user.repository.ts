import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { EntityRepository, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { User } from './entities/User';

import { AuthCredentialDTO } from './dto/AuthCredentialDTO ';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialDTO: AuthCredentialDTO): Promise<User> {
    // hash
    const salt = await bcrypt.genSalt();
    const { username, password } = authCredentialDTO;

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });
    try {
      return await this.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
