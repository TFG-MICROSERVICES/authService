import dotenv from 'dotenv';
import { Auth } from '../../models/auth.js';
import bcrypt from 'bcrypt';
import { generateError } from '../../utils/generateError.js';
import {
    getAuthService,
} from './authService.js';

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, PASSWD_DEFAULT } = process.env;

export const loginGoogle = (req, res, next) => {
    const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&scope=profile%20email`;
    res.status(200).json({ redirectUri });
}

export const loginCallBackGoogle = async (req, res, next) => {
    const { code } = req.query;

    if(!code) generateError('Error: No authorization code received', 400);

    try{
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            code: code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_CALLBACK_URL,
            grant_type: 'authorization_code'
          })
        });

        if(!response.status === 200) generateError('Error: Google authentication failed', 400);

        const { access_token, id_token, refresh_token } = await response.json();

        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        if(!userInfoResponse.status === 200) generateError('Error: Google authentication failed', 400);

        const user = await userInfoResponse.json();

        if(!user) generateError('Error: Google authentication failed', 400);

        const existAuth = await getAuthService(user.email);

        if(!existAuth){
            generateError('Error: User not registered', 404);
        }else{
            req.user = existAuth;
        }

        next();
    }catch(error){
        next(error);
    }
};
