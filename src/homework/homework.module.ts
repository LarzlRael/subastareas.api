import { Module, forwardRef } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryProvider } from './cloudinary.provider';
import { CommentsModule } from '../comments/comments.module';
import { OfferModule } from '../offer/offer.module';

import { Homework } from './entities/Homework.entity';
import { Offer } from '../offer/entities/offer.entity';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    WalletModule,
    //circular dependency

    forwardRef(() => OfferModule),
    forwardRef(() => CommentsModule),
    TypeOrmModule.forFeature([Homework, Offer]),
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService, CloudinaryProvider],
  exports: [CloudinaryProvider, HomeworkService],
})
export class HomeworkModule {}
