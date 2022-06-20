export enum RoleEnum {
  USER = 'user',
  STUDENT = 'student',
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  PROFESSOR = 'professor',
}
export enum HomeWorkStatusEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  TRADED = 'traded',
}
export enum TradeStatusEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  TRADED = 'traded',
  PENDINGTOTRADE = 'pending_to_trade',
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
  HOMEWORK_IMAGES = 'homework_images',
  PROFILE_IMAGES = 'profile_images',
  SOLVED_HOMEWORK_URL = 'solved_homework_url',
}

export enum LevelTypeEnum {
  PREUNIVERSITARIO = 'Preuniversitario',
  UNIVERSITARIO = 'Universitario',
}
export enum TypeNotificationEnum {
  NEWCOMMENT = 'new_comment',
  NEWOFFER = 'new_offer',
  OFFERACCEPTED = 'offer_accepted',
  HOMEWORKFINISHED = 'homework_finished',
}
