import AppError from "../../utils/AppError.js";
import Review from "./reviewModel.js";
import Movie from "../movies/movieModel.js";

// OPEN ACCESS

// Hämta alla recensioner
export const getAllReviews = async (req, res, next) => {
  const reviews = await Review.find().populate(
    "movieId",
    "title director releaseYear genre"
  );

  res.status(200).json({
    success: true,
    data: {
      reviews,
    },
  });
};

// Hämta en specifik recension via ID
export const findReviewById = async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id)
    .populate("movieId", "title director releaseYear genre")
    .populate("userId", "username");

  if (!review) {
    return next(new AppError("Recensionen hittades inte", 404));
  }

  res.status(200).json({
    success: true,
    data: review,
  });
};

// USER ONLY

// Skapa en ny recension
export const addReview = async (req, res, next) => {
  const userId = req.user.id;
  const { movieId, rating, comment } = req.body;

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return next(new AppError("Filmen finns inte", 404));
  }

  const trimmedComment = comment?.trim();

  const review = await Review.create({
    userId,
    movieId,
    rating,
    comment: trimmedComment,
  });

  res.status(201).json({
    success: true,
    message: "Recension tillagd",
    data: {
      movie: {
        id: movie.id,
        title: movie.title,
        director: movie.director,
        releaseYear: movie.releaseYear,
      },
      review,
    },
  });
};

// Uppdatera en recension (endast skaparen får göra detta)
export const updateReviewById = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const review = await Review.findById(id);
  if (!review) {
    return next(
      new AppError("Recensionen du vill uppdatera hittades inte", 404)
    );
  }

  if (review.userId.toString() !== req.user.id.toString()) {
    return next(
      new AppError(
        "Du är inte behörig att uppdatera denna recension eftersom du inte är dess skapare",
        403
      )
    );
  }

  if (updateData.comment) {
    updateData.comment = updateData.comment.trim();
  }

  const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("movieId", "title director releaseYear genre");

  res.status(200).json({
    success: true,
    message: "Recension uppdaterad",
    data: updatedReview,
  });
};

// Ta bort en recension (endast skaparen får göra detta)
export const deleteReviewById = async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    return next(
      new AppError("Recensionen du vill radera hittades inte", 404)
    );
  }

  if (review.userId.toString() !== req.user.id.toString()) {
    return next(
      new AppError(
        "Du är inte behörig att radera denna recension eftersom du inte är dess skapare",
        403
      )
    );
  }

  const deleted = await Review.findByIdAndDelete(id);
  const movie = await Movie.findById(deleted.movieId);

  res.status(200).json({
    success: true,
    message: "Recension raderad",
    data: {
      deleted,
      movieTitle: movie?.title || "Okänd titel",
    },
  });
};
