import { OAuth2Client } from 'google-auth-library';
import { IGoogleUser } from '../interfaces/jwtPayload';

const CLIENT_ID =
  '284069546633-2em7jlh59vhkj65ods09vnrb3kobc5so.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
export const validateGoogleToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [CLIENT_ID], // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload);

    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    const googleUser: IGoogleUser = {
      name: payload['name'],
      email: payload['email'],
      picture: payload['picture'],
    };
    return googleUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};
