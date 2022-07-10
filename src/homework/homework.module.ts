import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworkRepository } from './homework.repository';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryProvider } from './cloudinary.provider';
import { RolesModule } from 'src/roles/roles.module';
import { OfferRepository } from '../offer/offer.repository';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    CommentsModule,
    TypeOrmModule.forFeature([HomeworkRepository, OfferRepository, Wallet]),
    AuthModule,
    RolesModule,
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService, CloudinaryProvider],
  exports: [CloudinaryProvider, HomeworkService],
})
export class HomeworkModule {}
