import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { IpushNotification } from '../../interfaces/pushNotication';
import { capitalizeFirstLetter } from 'src/utils/utilsText';

@Injectable()
export class NotificationService {
  /* constructor() {} */

  async sendCommentNotification(userName, userPhones: any[], comment: string) {
    /* const homework = await this.homeworkRepository.findOne(idHomework); */
    /* console.log(homework); */
    const sendData: IpushNotification = {
      registration_ids: userPhones,
      notification: {
        title: `${capitalizeFirstLetter(userName)} ha comentado`,
        body: `${capitalizeFirstLetter(comment)}`,
        /* icon:
          'https://www.gstatic.com/devrel-devsite/prod/v4ff7513a940c844d7a200d0833ef676f25fef10662a3b57ca262bcf76cbd98e2/firebase/images/touchicon-180.png', */
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
