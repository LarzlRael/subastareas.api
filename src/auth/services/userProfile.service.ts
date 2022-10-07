import { Injectable } from '@nestjs/common';
import { UserProfile } from '../entities/userProfile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}
  createNewUserProfile(userId: number): Promise<UserProfile> {
    const newUserProfile = this.userProfileRepository.create({
      id: userId,
    });
    return this.userProfileRepository.save(newUserProfile);
  }
}
