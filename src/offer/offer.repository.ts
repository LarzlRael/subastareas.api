import { EntityRepository, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { OfferDto } from './dto/offer.dot';
import { Homework } from '../homework/entities/Homework.entity';
import { User } from '../auth/entities/user.entity';

@EntityRepository(Offer)
export class OfferRepository extends Repository<Offer> {
  async makeOffer(
    homework: Homework,
    user: User,
    offetDto: OfferDto,
  ): Promise<Offer> {
    const offer = this.create({
      user: user,
      homework: homework,
      priceOffer: offetDto.priceOffer,
    });
    return await this.save(offer);
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
      throw new Error('You are not the owner of this offer');
    }
  }
}
