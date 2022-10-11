import { Module, forwardRef } from '@nestjs/common';

import {
  AuthController,
  AdminController,
  UserProfileController,
} from './controllers/';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';

import { WalletService } from '../wallet/services/wallet.service';
import { RolesService } from '../roles/services/rols.service';

import { RolesModule } from '../roles/roles.module';
import { Wallet } from '../wallet/entities/wallet.entity';

import { Device } from '../devices/entities/devices.entity';
import { Rol } from '../roles/entities/rol.entity';
import { User, UserProfile } from './entities/';

import { WalletModule } from '../wallet/wallet.module';
import { DevicesModule } from '../devices/devices.module';
import { DevicesService } from '../devices/services';
import { UserProfileService, AdminService, AuthService } from './services/';

@Module({
  imports: [
    DevicesModule,
    WalletModule,
    MailModule,
    forwardRef(() => RolesModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 86400,
      },
    }),
    TypeOrmModule.forFeature([User, Device, Wallet, Rol, UserProfile]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    DevicesService,
    WalletService,
    AdminService,
    RolesService,
    UserProfileService,
  ],
  controllers: [AuthController, AdminController, UserProfileController],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
