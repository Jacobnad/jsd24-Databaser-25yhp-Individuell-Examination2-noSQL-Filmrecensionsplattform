import Joi from "joi";

const allowedGenres = [
  "action",
  "drama",
  "komedi",
  "sci-fi",
  "skräck",
  "thriller",
  "äventyr",
  "fantasy",
  "dokumentär",
  "romantik",
];

export const movieSchema = Joi.object({
  title: Joi.string().trim().max(150).required().messages({
    "string.max": "Titeln får vara max {#limit} tecken",
    "any.required": "Titeln saknas",
  }),
  director: Joi.string().trim().required().messages({
    "any.required": "Regissör saknas",
  }),
  releaseYear: Joi.number()
    .integer()
    .min(1888)
    .max(new Date().getFullYear())
    .messages({
      "number.base": "Releasedatum måste vara ett nummer",
      "number.min": "Releasedatum kan vara tidigast {#limit}",
      "number.max": "Releasedatum kan inte vara i framtiden",
    }),
  genre: Joi.array()
    .items(
      Joi.string()
        .lowercase()
        .valid(...allowedGenres)
        .messages({
          "any.only":
            "Ogiltig genre: {#value}. Tillåtna värden är: " +
            allowedGenres.join(", "),
        })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Genre måste vara en lista",
      "array.min": "Minst en genre måste anges",
      "any.required": "Genre saknas",
    }),
});

export const updateMovieSchema = Joi.object({
  title: Joi.string().trim().max(150).messages({
    "string.max": "Titeln får vara max {#limit} tecken",
  }),
  director: Joi.string().trim().messages({
    "string.base": "Regissör måste vara en sträng",
  }),
  releaseYear: Joi.number()
    .integer()
    .min(1888)
    .max(new Date().getFullYear())
    .messages({
      "number.base": "Releasedatum måste vara ett nummer",
      "number.min": "Releasedatum kan vara tidigast {#limit}",
      "number.max": "Releasedatum kan inte vara i framtiden",
    }),
  genre: Joi.array()
    .items(
      Joi.string()
        .valid(...allowedGenres)
        .messages({
          "any.only":
            "Ogiltig genre: {#value}. Tillåtna värden är: " +
            allowedGenres.join(", "),
        })
    )
    .min(1)
    .messages({
      "array.min": "Minst en genre måste anges",
    }),
})
  .min(1)
  .messages({
    "object.min": "Minst ett fält måste anges för uppdatering.",
  });

export const movieIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "string.hex": "movieId måste vara en giltig hex-sträng",
    "any.required": "movieId saknas",
  }),
});
