import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planes } from '../entities/planes.entity';
import axios from 'axios';
import { PriceDollarToday } from './../../interfaces/common';

@Injectable()
export class PlanesServices {
  constructor(
    @InjectRepository(Planes)
    private planesRepository: Repository<Planes>,
  ) {}

  private ratio = 3.1;
  private googleCommission = 0.3;
  private dollarAmount = 1;

  async getDollarPriceToday() {
    const response = await axios.get<PriceDollarToday>(
      'https://api.apilayer.com/exchangerates_data/latest&base=USD',
      {
        headers: {
          apiKey: process.env.APILAYER,
        },
      },
    );

    const bobToday = response.data.rates['BOB'];

    const planes = this.planesRepository.create({
      dateQuery: response.data.date,
      currencyType: 'BOB',
      currencyPriceUSDToday: bobToday,
      dollarAmount: this.dollarAmount,
      rate: this.ratio,
      /* currencyPrice: gemPrice,
      googleCommission: googleCommission, */
      /* finalAmount: response.data.rates['BOB'] * this.ratio, */
      /* gemPrice: gemPrice, */
      /* plan200: (googleCommission + gemPrice) * 0.98 * 200,
      plan100: (googleCommission + gemPrice) * 0.99 * 100,
      plan50: (googleCommission + gemPrice) * 0.995 * 50,
      plan25: (googleCommission + gemPrice) * 0.995 * 25,
      plan10: (googleCommission + gemPrice) * 0.99 * 10,
      plan5: (googleCommission + gemPrice) * 0.99 * 5,
      plan1: (googleCommission + gemPrice) * 0.1 * 1, */
    });
    await this.planesRepository.save(planes);
  }
  async getPlanes() {
    const entities = await this.planesRepository
      .createQueryBuilder('planes')
      .select([
        'planes.plan1',
        'planes.plan5',
        'planes.plan10',
        'planes.plan25',
        'planes.plan50',
        'planes.plan100',
        'planes.plan200',
      ])
      .getOne();
    return entities;
  }
}
