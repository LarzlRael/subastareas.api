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
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Device } from 'src/devices/entities/devices.entity';
import { Rol } from '../roles/entities/rol.entity';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [
    forwardRef(() => RolesModule),

    MailModule,
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
    TypeOrmModule.forFeature([User, Rol, Device, Wallet]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    DevicesService,
    WalletService,
    AdminService,
    RolsService,
  ],
  controllers: [AuthController, AdminController, AuthService],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
