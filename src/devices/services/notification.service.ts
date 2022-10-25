import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { IpushNotification as IPushNotification } from '../../interfaces/pushNotication';
import { capitalizeFirstLetter } from '../../utils/utilsText';

import { User } from '../../auth/entities/user.entity';
import { TypeNotificationEnum } from '../../enums/enums';
import { Homework } from '../../homework/entities/Homework.entity';

import { NotificationTypeEnum } from '../../enums/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { Notification } from '../entities';
import { DevicesService } from './devices.service';
import { Offer } from '../../offer/entities/offer.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private devicesService: DevicesService,
  ) {}

  async getUserNotifications(user: User) {
    const homeworks = await this.notificationRepository
      .createQueryBuilder('notification')
      .where({ userDestiny: user, visible: true })
      .orderBy('notification.created_at', 'DESC')
      .select([
        'notification',
        /* 'comment.user', */
        'user.id',
        'user.username',
        'user.profileImageUrl',
      ])
      .leftJoin('notification.userOrigin', 'user')
      .take(20)
      .getMany();
    return homeworks;
  }

  async deleteNotification(idNotification: string) {
    const notification = await this.getOneNotificationWhere({
      id: idNotification,
    });
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.visible = false;
    await this.notificationRepository.save(notification);
  }

  async seeNotification(idNotification: string) {
    const notification = await this.getOneNotificationWhere(
      {
        id: idNotification,
      },
      ['user'],
    );
    console.log(notification);
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.seen = true;
    await this.notificationRepository.save(notification);
  }

  async sendCommentNotification(
    user: User,
    comment: string,
    homework: Homework,
  ) {
    const sendData: IPushNotification = {
      registration_ids: await this.devicesService.getUserDevices(user),
      data: {
        type_notification: NotificationTypeEnum.COMMENT,
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
      type: TypeNotificationEnum.NEW_COMMENT,
      content: `${capitalizeFirstLetter(comment)}`,
      userOrigin: user,
      userDestiny: homework.user,
      idHomework: homework.id,
      idOffer: 0,
    });
    await this.notificationRepository.save(createNotification);
    await this.sendNotification(sendData);
  }

  async sendOfferAcceptedNotification(user: User, offer: Offer) {
    const sendData: IPushNotification = {
      registration_ids: await this.devicesService.getUserDevices(user),
      data: {
        type_notification: NotificationTypeEnum.OFFER_ACCEPTED,
        content: `El usuario ${user.name} ha aceptado tu oferta`,
      },
      notification: {
        title: `Oferta aceptada`,
        body: `Tu oferta ha sido aceptada`,
        /* icon:
          'https://www.gstatic.com/devrel-devsite/prod/v4ff7513a940c844d7a200d0833ef676f25fef10662a3b57ca262bcf76cbd98e2/firebase/images/touchicon-180.png', */
      },
    };

    const createNotification = this.notificationRepository.create({
      type: TypeNotificationEnum.OFFER_ACCEPTED,
      content: `Oferta aceptada`,
      userOrigin: user,
      userDestiny: offer.user,
      idOffer: offer.id,
      idHomework: 0,
    });
    await this.notificationRepository.save(createNotification);
    await this.sendNotification(sendData);
  }
  async sendHomeworkResolveNotification(user: User, homework: Homework) {
    const sendData: IPushNotification = {
      registration_ids: await this.devicesService.getUserDevices(user),
      data: {
        type_notification: NotificationTypeEnum.HOMEWORK_RESOLVE,
        content: `Tu tarea ha sido resuelta`,
      },
      notification: {
        title: `Tarea resuelta`,
        body: `Hechale un vistazo a tu tarea`,
        /* icon:
          'https://www.gstatic.com/devrel-devsite/prod/v4ff7513a940c844d7a200d0833ef676f25fef10662a3b57ca262bcf76cbd98e2/firebase/images/touchicon-180.png', */
      },
    };

    const createNotification = this.notificationRepository.create({
      type: TypeNotificationEnum.HOMEWORK_FINISHED,
      content: `Tarea resuelta`,
      userOrigin: user,
      userDestiny: homework.user,
      idHomework: homework.id,
      idOffer: 0,
    });
    await this.notificationRepository.save(createNotification);
    await this.sendNotification(sendData);
  }
  async sendTradeCompleteSuccessNotification(user: User, offer: Offer) {
    const sendData: IPushNotification = {
      registration_ids: await this.devicesService.getUserDevices(user),
      data: {
        type_notification: NotificationTypeEnum.HOMEWORK_RESOLVE,
        content: `Tu tarea ha sido aprobada satisfactoriamente`,
      },
      notification: {
        title: `Tarea finalizada con éxito`,
        body: `Hechale un vistazo a tu billetera`,
        /* icon:
          'https://www.gstatic.com/devrel-devsite/prod/v4ff7513a940c844d7a200d0833ef676f25fef10662a3b57ca262bcf76cbd98e2/firebase/images/touchicon-180.png', */
      },
    };

    const createNotification = this.notificationRepository.create({
      type: TypeNotificationEnum.HOMEWORK_FINISHED,
      content: `Tarea aceptada e intercambio completada satisfactoriamente`,
      userOrigin: user,
      userDestiny: offer.user,
      idOffer: offer.id,
      idHomework: 0,
    });
    await this.notificationRepository.save(createNotification);
    await this.sendNotification(sendData);
    /*database Transaction with multiples entities */
  }

  async sendNewOfferNotification(
    user: User,
    offer: number,
    homework: Homework,
  ) {
    const currency = 'Neo coins';
    const content = `${user.username} hizo una nueva oferta`;
    const sendData: IPushNotification = {
      registration_ids: await this.devicesService.getUserDevices(user),
      data: {
        type_notification: TypeNotificationEnum.NEW_OFFER,
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
      type: TypeNotificationEnum.NEW_OFFER,
      content: content,
      userOrigin: user,
      userDestiny: homework.user,
      idHomework: homework.id,
      idOffer: offer,
    });
    await this.notificationRepository.save(createNotification);
    await this.sendNotification(sendData);
  }

  async sendNotification(sendData: IPushNotification) {
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

  async clearNotifications(user: User) {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ notified: false })
      .where({ userDestiny: user })
      .execute();
  }
  async getOneNotificationWhere(
    where: FindOptionsWhere<Notification> | FindOptionsWhere<Notification>[],
    relations?: string[],
  ) {
    const res = await this.notificationRepository.findOne({
      where: where,
    });
    return res;
  }
}

//TODO enviar tambien el id del comentario u oferta
