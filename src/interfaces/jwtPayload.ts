export interface JWtPayload {
  username: string;
  iat?: number;
  exp?: number;
}
export interface IGoogleUser {
  name: string;
  email: string;
  picture: string;
  lastName: string;
}
