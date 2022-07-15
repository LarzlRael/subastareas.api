import { Module, forwardRef } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';

import { DevicesService } from '../devices/devices.service';
import { WalletService } from '../wallet/wallet.service';
import { AdminService } from './services/admin.service';

import { RolesModule } from '../roles/roles.module';
import { RolsService } from '../roles/services/rols.service';
import { Wallet } from '../wallet/entities/wallet.entity';

import { Device } from '../devices/entities/devices.entity';
import { Rol } from '../roles/entities/rol.entity';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { AdminController } from './controllers/admin.controller';
import { WalletModule } from '../wallet/wallet.module';
import { DevicesModule } from '../devices/devices.module';

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
    TypeOrmModule.forFeature([User, Device, Wallet, Rol]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    DevicesService,
    WalletService,
    AdminService,
    RolsService,
  ],
  controllers: [AuthController, AdminController],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
