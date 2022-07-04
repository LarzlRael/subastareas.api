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
  ): Promise<boolean> {
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
        await this.save(offer);
        return true;
      } else {
        throw new InternalServerErrorException('You already have an offer');
        return false;
      }
    } else {
      const offer = this.create({
        user: user,
        homework: homework,
        priceOffer: offerDto.priceOffer,
      });
      await this.save(offer);
      return true;
    }
  }
  async getOffersByHomeworks(homework: Homework) {
    return await this.createQueryBuilder('offer')
      .where({ homework: homework })
      .select([
        'offer.id',
        'offer.priceOffer',

        /* 'offer.createdAt', */
        'user.id',
        'user.username',
        'user.profileImageUrl',
        /* 'user.email', */
      ])
      .leftJoin('offer.user', 'user') // bar is the joined table
      .getMany();
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
