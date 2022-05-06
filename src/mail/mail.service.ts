import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(
    user: { email: string; name: string },
    token: string,
  ) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Bienvenido a subastareas, confirma tu email',
      template: 'confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });
  }
  async sendEmailVerification(
    hostName: string,
    user: { email: string; name: string },
    token: string,
  ) {
    const url = `${hostName}/auth/verifyemail/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Bienvenido a SUBASTAREAS! confirma tu Email',
      template: 'confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });
  }
  async sendEmailRequestpasswordChange(
    user: { email: string; name: string },
    token: string,
    hostName,
  ) {
    const url = `${hostName}/auth/changePassoword/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Solicitud de cambio de contraseña',
      template: 'requestPasswordChange', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });
  }
}
