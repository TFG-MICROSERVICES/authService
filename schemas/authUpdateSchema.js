import Joi from 'joi';

export const authUpdateSchema = Joi.object({
    email: Joi.string().email().allow('', null).messages({
        'string.email': 'El email debe ser un email válido',
    }),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*_])[A-Za-z\\d!@#$%^&*_]{8,}$'))
        .allow('', null)
        .messages({
            'string.pattern.base':
                'La contraseña debe tener al menos 8 caracteres e incluir al menos una mayúscula, una minúscula, un número, y un caracter especial',
        }),
});
