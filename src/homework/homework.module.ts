import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworkRepository } from './homework.repository';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryProvider } from './cloudinary.provider';
import { RolesModule } from 'src/roles/roles.module';
import { OfferRepository } from '../offer/offer.repository';
import { CommentRepository } from '../comments/comment.repository';
import { WalletRepository } from '../wallet/wallet.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HomeworkRepository,
      OfferRepository,
      CommentRepository,
      WalletRepository,
    ]),
    AuthModule,
    RolesModule,
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService, CloudinaryProvider],
  exports: [CloudinaryProvider, HomeworkService],
})
export class HomeworkModule {}
