import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';

import { DevicesService } from '../devices/devices.service';
import { DeviceRepository } from '../devices/device.repository';
import { WalletRepository } from '../wallet/wallet.repository';
import { WalletService } from '../wallet/wallet.service';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RolRepository } from 'src/roles/repositories/rol.repository';
import { RolesService } from 'src/roles/services/roles.service';
import { RolesModule } from '../roles/roles.module';
import { RolsService } from '../roles/services/rols.service';

@Module({
  imports: [
    MailModule,
    RolesModule,
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
    TypeOrmModule.forFeature([
      UsersRepository,
      RolRepository,
      DeviceRepository,
      WalletRepository,
    ]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    DevicesService,
    WalletService,
    AdminService,
    RolesService,
    RolsService,
  ],
  controllers: [AuthController, AdminController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
