import AppError from "../utils/AppError.js";

// Central felhanterare
const errorHandler = (err, req, res, next) => {
  console.error("Felmeddelande:", err);

  let error = err;

  // Hantera dubblettfel för filmer (titel + år)
  if (
    err.code === 11000 &&
    err.keyPattern?.title &&
    err.keyPattern?.releaseYear
  ) {
    error = new AppError("En film med samma titel och år finns redan", 400);
  }

  // Hantera dubblettfel för recensioner (en recension per användare per film)
  else if (
    err.code === 11000 &&
    err.keyPattern?.movieId &&
    err.keyPattern?.userId
  ) {
    error = new AppError("Du har redan recenserat denna film", 400);
  }

  // Hantera övriga okända fel som inte är AppError
  else if (!(err instanceof AppError)) {
    error = new AppError("Internt serverfel", 500, false);
  }

  res
    .status(error.statusCode)
    .json({ message: error.message, status: error.statusCode });
};

export default errorHandler;
