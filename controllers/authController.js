import { loginAuthService, registerAuthService } from '../db/services/authService';
import schemaAuth from '../utils/schemaAuth';
import jwt from 'jsonwebtoken';

export async function loginCallBack(req, res, next) {
    try {
        const validate = schemaAuth.validateAsync(req.body);

        const user = await loginAuthService(validate);

        const token = jwt.sign(
            { 
                email: user.email,
                admin: user.role
            }, 
            process.env.JWT_SECRET,
            { 
                expiresIn: '30min' 
            }
        );

        const refreshToken = jwt.sign(
            { 
                email: user.email,
                admin: user.role 
            }, 
            process.env.JWT_SECRET,
            { 
                expiresIn: '1d' 
            }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: 200,
            user,
            token,
        });
    } catch (error) {
        next(error);
    }
}

export async function register(req, res, next) {
    try {
        const validate = await schemaAuth.validateAsync(req.body);

        const newUser = await registerAuthService(validate);

        res.status(201).json({
            status: 201,
            user: newUser,
        });
    }catch(error){
        next(error);
    }
}
    
