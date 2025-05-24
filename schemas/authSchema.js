import Joi from 'joi';

export const authSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'El email debe ser un email válido',
        'any.required': 'El email es obligatorio',
    }),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*_])[A-Za-z\\d!@#$%^&*_]{8,}$')).required().messages({
        'string.pattern.base':
            'La contraseña debe tener al menos 8 caracteres e incluir al menos una mayúscula, una minúscula, un número, y un caracter especial',
        'any.required': 'La contraseña es obligatoria',
    }),
});
