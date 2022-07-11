import { Module, forwardRef } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryProvider } from './cloudinary.provider';
import { RolesModule } from 'src/roles/roles.module';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { CommentsModule } from '../comments/comments.module';
import { OfferModule } from '../offer/offer.module';
import { Offer } from '../offer/entities/offer.entity';
import { Homework } from './entities/Homework.entity';

@Module({
  imports: [
    //ciruclar dependency

    RolesModule,
    forwardRef(() => OfferModule),
    forwardRef(() => CommentsModule),
    TypeOrmModule.forFeature([Homework]),
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService, CloudinaryProvider],
  exports: [CloudinaryProvider, HomeworkService],
})
export class HomeworkModule {}
