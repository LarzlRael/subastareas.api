import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { IpushNotification } from '../../interfaces/pushNotication';
import { capitalizeFirstLetter } from 'src/utils/utilsText';
import { NotificationRepository } from './repository/notification.repository';
import { User } from '../../auth/entities/user.entity';
import { TypeNotificationEnum } from 'src/enums/enums';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async getUserNotification(user: User) {
    /*  return await this.notificationRepository.find({
      where: { user: user },
      relations: ['user'],
    }); */
    const homeworks = await this.notificationRepository
      .createQueryBuilder('notification')
      .where({ user: user })
      .orderBy('notification.created_at', 'DESC')
      .select([
        'notification',
        /* 'comment.user', */
        'user.username',
        'user.profileImageUrl',
      ])
      .leftJoin('notification.user', 'user')
      /* .leftJoin('homework.user', 'user') */
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
    userPhones: any[],
    comment: string,
  ) {
    console.log('sending comment notification');
    const sendData: IpushNotification = {
      registration_ids: userPhones,
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
      user: user,
    });
    await this.notificationRepository.save(createNotification);
    await this.sendNotification(sendData);
  }
  async sendNewOfferNotification(user: User, userPhones: any[], offer: number) {
    /* const homework = await this.homeworkRepository.findOne(idHomework); */
    /* console.log(homework); */
    const currency = 'Neo coins';
    const content = `${user.username} hizo una nueva oferta`;
    const sendData: IpushNotification = {
      registration_ids: userPhones,
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
      user: user,
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
}


//TODO enviar tambien el id del comentario u oferta