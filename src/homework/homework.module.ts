import { Module, forwardRef } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworkRepository } from './homework.repository';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryProvider } from './cloudinary.provider';
import { RolesModule } from 'src/roles/roles.module';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { CommentsModule } from '../comments/comments.module';
import { OfferModule } from '../offer/offer.module';
import { Offer } from '../offer/entities/offer.entity';

@Module({
  imports: [
    //ciruclar dependency
    forwardRef(() => OfferModule),
    CommentsModule,
    TypeOrmModule.forFeature([HomeworkRepository, Offer, Wallet]),
    AuthModule,
    RolesModule,
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService, CloudinaryProvider],
  exports: [CloudinaryProvider, HomeworkService],
})
export class HomeworkModule {}
