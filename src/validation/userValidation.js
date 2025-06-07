import Joi from "joi";

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "email.base": "Ogiltigt epost-format",
    "any.required": "Epost saknas",
  }),
  username: Joi.string().min(3).max(20).required().messages({
    "string.min": "Användarnamnet måste vara minst {#limit} tecken",
    "string.max": "Användarnamnet får vara max {#limit} tecken",
    "any.required": "Användarnamn saknas",
  }),
  password: Joi.string().min(6).max(50).required().messages({
    "string.min": "Lösenordet måste vara minst {#limit} tecken",
    "string.max": "Lösenordet får vara max {#limit} tecken",
    "any.required": "Lösenord saknas",
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().messages({
    "email.base": "Ogiltigt epost-format",
  }),
  username: Joi.string().min(3).max(20).messages({
    "string.min": "Användarnamnet måste vara minst {#limit} tecken",
    "string.max": "Användarnamnet får vara max {#limit} tecken",
  }),
  password: Joi.string().min(6).max(50).required().messages({
    "string.min": "Lösenordet måste vara minst {#limit} tecken",
    "string.max": "Lösenordet får vara max {#limit} tecken",
    "any.required": "Lösenord saknas",
  }),
})
  .or("email", "username")
  .messages({
    "object.missing": "Du måste ange antingen epost eller användarnamn",
  });

export const userIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "string.hex": "userId måste vara en giltig hex-sträng",
    "any.required": "userId saknas",
  }),
});
