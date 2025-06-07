import Joi from "joi";

export const reviewSchema = Joi.object({
  movieId: Joi.string().length(24).hex().required().messages({
    "string.hex": "movieId måste vara en giltig hex-sträng",
    "any.required": "movieId saknas",
  }),
  rating: Joi.number().integer().min(1).max(10).required().messages({
    "number.base": "Rating måste vara ett nummer",
    "number.min": "Rating måste vara minst {#limit}",
    "number.max": "Rating får vara max {#limit}",
    "any.required": "Rating saknas",
  }),
  comment: Joi.string().max(5000).trim().optional().messages({
    "string.base": "Kommentaren måste vara en sträng",
    "string.max": "Kommentaren får vara max {#limit} tecken",
    "any.required": "Kommentar saknas",
  }),
});

export const updateReviewSchema = Joi.object({
  movieId: Joi.string().length(24).hex().messages({
    "string.hex": "movieId måste vara en giltig hex-sträng",
  }),
  rating: Joi.number().integer().min(1).max(10).messages({
    "number.base": "Rating måste vara ett nummer",
    "number.min": "Rating måste vara minst {#limit}",
    "number.max": "Rating får vara max {#limit}",
  }),
  comment: Joi.string().max(5000).trim().messages({
    "string.base": "Kommentaren måste vara en sträng",
    "string.max": "Kommentaren får vara max {#limit} tecken",
  }),
}).min(1).messages({
  "object.min": "Minst ett fält måste anges för uppdatering."
});

export const reviewIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "string.hex": "reviewId måste vara en giltig hex-sträng",
    "any.required": "reviewId saknas",
  }),
});
