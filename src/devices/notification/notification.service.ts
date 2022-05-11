import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpushNotification } from '../../interfaces/pushNotication';

@Injectable()
export class NotificationService {
  /* constructor() {} */

  async sendNotification(
    devicesTargets: string[],
    nameOrigin: any,
    saldo: string,
  ) {
    console.log('Notification sent');

    const sendData: IpushNotification = {
      registration_ids: devicesTargets,
      notification: {
        title: `Saldo recibido`,
        body: `EL usuario ${nameOrigin} te envio ${saldo} BS`,
        icon:
          'https://www.gstatic.com/devrel-devsite/prod/v4ff7513a940c844d7a200d0833ef676f25fef10662a3b57ca262bcf76cbd98e2/firebase/images/touchicon-180.png',
      },
    };

    try {
      await axios({
        method: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        data: sendData,
        headers: {
          Authorization: `key=${process.env.FIREBASE_TOKEN}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
