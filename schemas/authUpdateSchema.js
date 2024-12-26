import Joi from "joi";

export const authUpdateSchema = Joi.object({
    email: Joi.string().email().allow("",null).messages({
        "string.email": "The email must be a valid email",
    }),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*_])[A-Za-z\\d!@#$%^&*_]{8,}$')).allow("",null).messages({
        "string.pattern.base": "The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});