import AppError from "../utils/AppError.js";

const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return next(new AppError(messages.join("; "), 400));
    }
    next();
  };
};

export default validate;
