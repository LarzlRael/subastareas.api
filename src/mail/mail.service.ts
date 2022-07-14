import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
interface UserEmailI {
  email: string;
  name: string;
}
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendUserConfirmation(user: UserEmailI, token: string) {
    // cambiar por el url del front
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
    user: UserEmailI,
    token: string,
  ) {
    const url = `${hostName}/completeregister?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support @example.com>', // override default from
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
    user: UserEmailI,
    token: string,
    hostname,
  ) {
    const url = hostname + '/changepassword?token=' + token;

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
