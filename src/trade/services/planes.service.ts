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
          apiKey: process.env.API_LAYER,
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
    });
    return await this.planesRepository.save(planes);
  }
  async getPlanes() {
    const planes = await this.planesRepository
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
    if (!planes) {
      this.getDollarPriceToday();
    } else {
      const planeParse = Object.keys(planes).map((key) => {
        return {
          planeName: key,
          priceUsd: parseFloat(planes[key]),
          amount: parseInt(key.substring(4, key.length)),
          /* priceBob: Math.ceil(parseFloat((planes[key] * 6.96).toFixed(2))), */
          priceBob: parseFloat((planes[key] * 6.96).toFixed(2)),
          nameBobPrice: 'BOB',
        };
      });
      const planId = await this.planesRepository
        .createQueryBuilder('planes')
        .select(['planes.id'])
        .getOne();
      return planeParse
        .map((plane) => {
          return {
            ...plane,
            planId: planId.id,
          };
        })
        .reverse();
    }
  }
  async getPlan(id: number) {
    const plan = await this.planesRepository.findOne({
      where: {
        id,
      },
    });
    if (!plan) {
      throw new InternalServerErrorException('Plan not found');
    }
    return plan;
  }
}
