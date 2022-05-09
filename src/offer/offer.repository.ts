import { EntityRepository, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { OfferDto } from './dto/offer.dot';
import { Homework } from '../homework/entities/Homework.entity';
import { User } from '../auth/entities/user.entity';
import { validateArray } from '../utils/validation';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Offer)
export class OfferRepository extends Repository<Offer> {
  async makeOffer(
    homework: Homework,
    user: User,
    offerDto: OfferDto,
  ): Promise<Offer> {
    if (validateArray(homework.offers)) {
      const verifyOffer = homework.offers.some(
        (offer) => offer.user.id === user.id,
      );
      if (!verifyOffer) {
        const offer = this.create({
          user: user,
          homework: homework,
          priceOffer: offerDto.priceOffer,
        });
        return await this.save(offer);
      } else {
        throw new InternalServerErrorException('You already have an offer');
      }
    } else {
      const offer = this.create({
        user: user,
        homework: homework,
        priceOffer: offerDto.priceOffer,
      });
      return await this.save(offer);
    }
  }
  async getOffersByHomeworks(homework: Homework): Promise<Offer[]> {
    return await this.find({
      where: { homework: homework },
    });
  }
  async deleteOffer(user: User, idOffer) {
    const findOffer = await this.findOne(idOffer);
    if (findOffer.user.id === user.id) {
      await this.delete(idOffer);
      return findOffer;
    } else {
      throw new InternalServerErrorException(
        'You are not the owner of this offer',
      );
    }
  }
}
