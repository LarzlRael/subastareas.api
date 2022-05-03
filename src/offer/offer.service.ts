import { Injectable } from '@nestjs/common';
import { OfferRepository } from './offer.repository';
import { HomeworkRepository } from '../homework/homework.repository';
import { OfferDto } from './dto/offer.dot';
import { User } from 'src/auth/entities/user.entity';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OfferService {
  constructor(
    private offerRepository: OfferRepository,
    private HomeworkRepository: HomeworkRepository,
  ) { }

  async makeOffer(
    idHomework: string,
    offerDto: OfferDto,
    user: User,
  ): Promise<Offer> {
    console.log(idHomework);
    const getHomeWork = await this.HomeworkRepository.findOne();
    if (!getHomeWork) {
      throw new Error('Homework not found');
    }
    return this.offerRepository.makeOffer(getHomeWork, user, offerDto);
  }

  async getOffersByHomeworks(idHomework: string): Promise<Offer[]> {
    const getHomeWork = await this.HomeworkRepository.findOne(idHomework);
    if (!getHomeWork) {
      throw new Error('Homework not found');
    }
    return this.offerRepository.getOffersByHomeworks(getHomeWork);
  }
}
