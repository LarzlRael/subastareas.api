import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { EntityRepository, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

import { AuthCredentialDTO } from './dto/AuthCredentialDTO ';
import { uploadFile } from '../utils/utils';
import { ProfileEditDto } from './dto/ProfileEdit.dto';

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
  async updateUserProfile(
    updateUser: ProfileEditDto,
    profileImageUrl: Express.Multer.File,
    user: User,
  ): Promise<User> {
    console.log(user);
    try {
      if (profileImageUrl) {
        uploadFile(profileImageUrl, 'PROFILE_IMAGES').then(async (url) => {
          updateUser.profileImageUrl = url;
          const updatedProfile = await this.save({
            ...user,
            name: updateUser.name,
            lastName: updateUser.lastName,
            nickName: updateUser.nickName,
            phone: updateUser.phone,
            profileImageUrl: updateUser.profileImageUrl,
          });
          return updatedProfile;
        });
      } else {
        return await this.save({
          ...user,
          name: updateUser.name,
          lastName: updateUser.lastName,
          nickName: updateUser.nickName,
          phone: updateUser.phone,
        });
      }
    } catch (error) {
      console.log('Este es el error');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
