import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { IpushNotification } from '../../interfaces/pushNotication';
import { capitalizeFirstLetter } from 'src/utils/utilsText';
import { NotificationRepository } from './repository/notification.repository';
import { User } from '../../auth/entities/user.entity';
import { TypeNotificationEnum } from 'src/enums/enums';
import { DeviceRepository } from '../device.repository';
import { Homework } from '../../homework/entities/Homework.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async getUserNotification(user: User) {
    const homeworks = await this.notificationRepository
      .createQueryBuilder('notification')
      .where({ userDestiny: user })
      .orderBy('notification.created_at', 'DESC')
      .select([
        'notification',
        /* 'comment.user', */
        'user.id',
        'user.username',
        'user.profileImageUrl',
      ])
      .leftJoin('notification.userOrigin', 'user')
      .getMany();
    return homeworks;
  }
  async deleteNotification(idNotification: string) {
    const notification = await this.notificationRepository.findOne(
      idNotification,
    );
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.visible = false;
    await this.notificationRepository.save(notification);

    /* return await this.notificationRepository.find({
      where: { user: user },
    }); */
  }
  async seeNotification(idNotification: string) {
    const notification = await this.notificationRepository.findOne(
      idNotification,
      {
        relations: ['user'],
      },
    );
    notification.seen = true;
    if (!notification) {
      throw new Error('Notification not found');
    }
    await this.notificationRepository.save(notification);

    /* return await this.notificationRepository.find({
      where: { user: user },
    }); */
  }

  async sendCommentNotification(
    user: User,
    comment: string,
    homework: Homework,
  ) {
    const sendData: IpushNotification = {
      registration_ids: await this.getUserDevices(user),
      data: {
        type_notification: 'comment',
        content: `${user.username}: ${comment}`,
      },
      notification: {
        title: `${capitalizeFirstLetter(user.username)} ha comentado`,
        body: `${capitalizeFirstLetter(comment)}`,
        /* icon:
          'https://www.gstatic.com/devrel-devsite/prod/v4ff7513a940c844d7a200d0833ef676f25fef10662a3b57ca262bcf76cbd98e2/firebase/images/touchicon-180.png', */
      },
    };

    const createNotification = this.notificationRepository.create({
      type: TypeNotificationEnum.NEWCOMMENT,
      content: `${capitalizeFirstLetter(comment)}`,
      userOrigin: user,
      userDestiny: homework.user,
      idHomeworkOrOffer: parseInt(homework.id),
    });
    await this.notificationRepository.save(createNotification);
    await this.sendNotification(sendData);
  }

  async sendOfferAcceptedNotification(user: User, homework: Homework) {
    console.log(await this.getUserDevices(user));
    const sendData: IpushNotification = {
      registration_ids: await this.getUserDevices(user),
      data: {
        type_notification: 'offer_accepted',
        content: `El usuario user ha aceptado tu oferta`,
      },
      notification: {
        title: `Oferta aceptada`,
        body: `Tu oferta ha sido aceptada`,
        /* icon:
          'https://www.gstatic.com/devrel-devsite/prod/v4ff7513a940c844d7a200d0833ef676f25fef10662a3b57ca262bcf76cbd98e2/firebase/images/touchicon-180.png', */
      },
    };

    const createNotification = this.notificationRepository.create({
      type: TypeNotificationEnum.OFFERACCEPTED,
      content: `Nueva oferta`,
      userOrigin: user,
      userDestiny: homework.user,
      idHomeworkOrOffer: parseInt(homework.id),
    });
    await this.notificationRepository.save(createNotification);
    await this.sendNotification(sendData);
  }

  async sendNewOfferNotification(
    user: User,
    offer: number,
    homework: Homework,
  ) {
    /* const homework = await this.homeworkRepository.findOne(idHomework); */
    /* console.log(homework); */
    const currency = 'Neo coins';
    const content = `${user.username} hizo una nueva oferta`;
    const sendData: IpushNotification = {
      registration_ids: await this.getUserDevices(user),
      data: {
        type_notification: 'new_offer',
        content: content,
        icon:
          'https://www.iconplc.com/site-files/cms-templates/images/open-graph/OG_Facebook.png',
      },
      notification: {
        title: `Nueva oferta`,
        body: `${user.username} Hizo una oferta de ${offer} ${currency}`,
        /* icon:
          'https://www.gstatic.com/devrel-devsite/prod/v4ff7513a940c844d7a200d0833ef676f25fef10662a3b57ca262bcf76cbd98e2/firebase/images/touchicon-180.png', */
      },
    };
    const createNotification = this.notificationRepository.create({
      type: TypeNotificationEnum.NEWOFFER,
      content: content,
      userOrigin: user,
      userDestiny: homework.user,
      idHomeworkOrOffer: parseInt(homework.id),
    });
    await this.notificationRepository.save(createNotification);
    await this.sendNotification(sendData);
  }

  async sendNotification(sendData: IpushNotification) {
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

  async clearNotificated(user: User) {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ notified: false })
      .where({ userDestiny: user })
      .execute();
  }

  async getUserDevices(user: User): Promise<string[]> {
    const gerUserDevices = await this.deviceRepository.find({ user });
    return gerUserDevices.map((device) => device.idDevice);
  }
}

//TODO enviar tambien el id del comentario u oferta
