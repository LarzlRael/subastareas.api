import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferRepository } from './offer.repository';
import { HomeworkRepository } from '../homework/homework.repository';
import { OfferController } from './offer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OfferRepository, HomeworkRepository])],
  providers: [OfferService],
  controllers: [OfferController],
})
export class OfferModule {}
