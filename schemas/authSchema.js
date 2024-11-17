import Joi from "joi";

const authSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "El email debe ser un email válido",
        "any.required": "El email es requerido",
    }),
    password: Joi.string().min(8).required().messages({
        "string.min": "La contraseña debe tener al menos 8 caracteres",
        "any.required": "La contraseña es requerida",
    }),
    admin: Joi.boolean().default(false).required().messages({
        "boolean.base": "El campo admin debe ser un booleano",
        "any.required": "El campo admin es requerido",
    }),
});