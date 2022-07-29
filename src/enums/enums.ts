export enum RoleEnum {
  USER = 'user',
  STUDENT = 'student',
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  PROFESSOR = 'professor',
}
export enum HomeWorkStatusEnum {
  PENDING_TO_APPROVED = 'pending_to_approved',
  PENDING_TO_RESOLVE = 'pending_to_resolve',
  ACCEPTED = 'accepted_to_offer',
  REJECTED = 'rejected',
  TRADED = 'traded',
}
export enum TradeStatusEnum {
  // change to betters names
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  TRADED = 'traded',
  PENDINGTOTRADE = 'pending_to_trade',
  PENDINGTOACCEPT = 'pending_to_accept',
  PENDING_TO_RESOLVE = 'pending_to_resolve',
}

export enum HomeWorkTypeEnum {
  MATEMATICA = 'Matematica',
  PROGRAMACION = 'Programación',
  FISICA = 'Física',
  QUIMICA = 'Química',
  ALGEBRA = 'Algebra',
  TRIGONOMETRIA = 'Trigonometria',
  GEOMETRIA = 'Geometria',
  INGLES = 'Ingles',
  CONTABILIDAD = 'Contabilidad',
}

export enum FoldersNameEnum {
  HOMEWORK = 'homework',
  HOMEWORK_PDF = 'homework_pdf',
  HOMEWORK_IMAGES = 'homework_images',
  PROFILE_IMAGES = 'profile_images',
  SOLVED_HOMEWORK_URL = 'solved_homework',
}

export enum LevelTypeEnum {
  PREUNIVERSITARIO = 'Preuniversitario',
  UNIVERSITARIO = 'Universitario',
}
export enum TypeNotificationEnum {
  NEW_COMMENT = 'new_comment',
  NEW_OFFER = 'new_offer',
  OFFER_ACCEPTED = 'offer_accepted',
  HOMEWORK_FINISHED = 'homework_finished',
}
export enum NotificationTypeEnum {
  NEW_OFFER = 'new_offer',
  COMMENT = 'comment',
  OFFER_ACCEPTED = 'offer_accepted',
  HOMEWORK_RESOLVE = 'homework_resolve',
}
export enum TableNameEnum {
  ROLS = 'rols',
  WALLET = 'wallet',
  DEVICE = 'device',
}

export enum TransactionTypeEnum {
  INGRESO = 'ingreso',
  EGRESO = 'egreso',
  ASEGURADO = 'asegurado',
  RETENIDO = 'retenido',
  TRASPASO = 'traspaso',
}
