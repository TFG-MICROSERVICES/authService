import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { generateError } from '../../utils/generateError.js';
import { getAuthService, registerAuthService } from './authService.js';

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, PASSWD_DEFAULT } = process.env;

//Callback from Google login to get user data and checked if user is registered
export const loginCallBackGoogle = async (req, res, next) => {
    const { code } = req.query;

    try {
        if (!code) generateError('Error: No authorization code received', 400);
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_CALLBACK_URL,
                grant_type: 'authorization_code',
            }),
        });

        console.log("response google", response);

        if (response.status !== 200) {
            const error = await response.json();
            console.log(error);
            generateError(error.message, response.status);
        }

        const { access_token, id_token, refresh_token } = await response.json();

        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (userInfoResponse.status !== 200) generateError('Error: Google authentication failed', 400);

        const user = await userInfoResponse.json();

        if (!user) generateError('Error: Google authentication failed', 400);

        const existAuth = await getAuthService(user.email);

        //If user is not registered, throw error
        if (!existAuth) {
            const newAuth = await registerAuthService({
                email: user.email,
                password: PASSWD_DEFAULT,
                admin: false,
            });

            if (!newAuth) generateError('Error: User could not be registered', 500);

            res.status(201).json({
                status: 201,
                message: 'User registered successfully',
                user: {
                    email: newAuth.email,
                    password: newAuth.password,
                    admin: newAuth.admin,
                    new: true,
                },
            });
        } else {
            req.user = {
                email: existAuth.email,
                password: existAuth.password,
                admin: existAuth.admin,
                new: false,
            };
        }

        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};
