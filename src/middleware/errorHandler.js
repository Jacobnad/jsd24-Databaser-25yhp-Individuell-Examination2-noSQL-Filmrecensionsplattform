import AppError from "../utils/AppError.js";

const errorHandler = (err, req, res, next) => {
  console.error("ERR:", err);

  let error = err;

  if (
    err.code === 11000 &&
    err.keyPattern?.title &&
    err.keyPattern?.releaseYear
  ) {
    error = new AppError("Det finns redan en film med samma titel & år", 400);
  } else if (
    err.code === 11000 &&
    err.keyPattern?.movieId &&
    err.keyPattern?.userId
  ) {
    error = new AppError("Du kan bara ge ett omdöme per film", 400);
  } else if (!(err instanceof AppError)) {
    error = new AppError("Internal Server Error", 500, false);
  }

  res
    .status(error.statusCode)
    .json({ message: error.message, status: error.statusCode });
};

export default errorHandler;
