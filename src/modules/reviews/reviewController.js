import AppError from "../../utils/AppError.js";
import Review from "./reviewModel.js";
import Movie from "../movies/movieModel.js";

//OPEN ACCESS:
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

export const findReviewById = async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id)
    .populate("movieId", "title director releaseYear genre")
    .populate("userId", "username");

  if (!review) return next(new AppError("Recension hittades inte", 404));

  res.status(200).json({
    success: true,
    data: review,
  });
};

//USER ONLY:
export const addReview = async (req, res, next) => {
  const userId = req.user.id;
  const { movieId, rating, comment } = req.body;

  const movie = await Movie.findById(movieId);
  if (!movie) return next(new AppError("Filmen finns inte", 404));

  const review = await Review.create({ userId, movieId, rating, comment });

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

export const updateReviewById = async (req, res, next) => {
  const { id } = req.params;
  const update = req.body;

  const review = await Review.findById(id);
  if (!review)
    return next(
      new AppError("Recensionen du vill uppdatera hittades inte", 404)
    );

  if (review.userId.toString() !== req.user.id.toString()) {
    return next(
      new AppError(
        "Du är inte behörig att uppdatera denna recension pga du har inte skapat den",
        403
      )
    );
  }

  const updatedReview = await Review.findByIdAndUpdate(id, update, {
    new: true,
  }).populate("movieId", "title director releaseYear genre");

  res.status(200).json({
    success: true,
    message: "Recension uppdaterad",
    data: updatedReview,
  });
};

export const deleteReviewById = async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review)
    return next(new AppError("Recensionen du vill radera hittades inte", 404));

  if (review.userId.toString() !== req.user.id.toString()) {
    return next(
      new AppError(
        "Du är inte behörig att radera denna recensionpga du har inte skapat den",
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
      deleted: deleted,
      movieTitle: movie.title,
    },
  });
};
