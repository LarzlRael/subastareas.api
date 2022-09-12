import { OAuth2Client } from 'google-auth-library';
import { IGoogleUser } from '../../interfaces/jwtPayload';

const CLIENT_ID =
  '917999900039-hhmp729r4qk00euhcqh7c7l25t9c9gak.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
export const validateGoogleToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload);

    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    /* {
      iss: 'https://accounts.google.com',
      azp: '917999900039-20808mbi8pt1j1hdo2jaqq9vgkpu96of.apps.googleusercontent.com',
      aud: '917999900039-hhmp729r4qk00euhcqh7c7l25t9c9gak.apps.googleusercontent.com',
      sub: '113296580014551426913',
      email: 'reynaldo.gt.gt@gmail.com',
      email_verified: true,
      name: 'Reynaldo Guarachi Tola',
      picture: 'https://lh3.googleusercontent.com/a/AATXAJwZG68LKmgG4Ndv1rlbCJQgwV9RLPaSfkv1lW5P=s96-c',
      given_name: 'Reynaldo',
      family_name: 'Guarachi Tola',
      locale: 'es',
      iat: 1654287466,
      exp: 1654291066
    } */

    const googleUser: IGoogleUser = {
      name: payload['given_name'],
      email: payload['email'],
      picture: payload['picture'],
      lastName: payload['family_name'],
    };
    return googleUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};
