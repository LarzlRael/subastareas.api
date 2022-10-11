import { Injectable } from '@nestjs/common';
import { UserProfile } from '../entities/userProfile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfileDTO } from '../dto/UserProfile.dot';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}
  async createNewUserProfile(userId: number): Promise<UserProfile> {
    const newUserProfile = this.userProfileRepository.create({
      id: userId,
    });
    return await this.userProfileRepository.save(newUserProfile);
  }
  async changePreferences(
    userProfileDto: UserProfileDTO,
  ): Promise<UserProfile> {
    let userProfile = await this.userProfileRepository.findOne({
      where: { id: userProfileDto.id },
    });
    userProfile = { ...userProfile, ...userProfileDto };

    return await this.userProfileRepository.save(userProfile);
  }
}
