import Joi from "joi";

export const authSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "The email must be a valid email",
        "any.required": "The email is required",
    }),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*_])[A-Za-z\\d!@#$%^&*_]{8,}$')).required().messages({
        "string.pattern.base": "The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "The password is required",
    }),
});