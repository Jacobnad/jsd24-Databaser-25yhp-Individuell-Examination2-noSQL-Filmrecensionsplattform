import AppError from "../../utils/AppError.js";
import Movie from "./movieModel.js";
import Review from "../reviews/reviewModel.js";
import { ObjectId } from "mongoose";

const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Öppet för alla
export const getAllMovies = async (req, res, next) => {
  const movies = await Movie.find();

  res.status(200).json({
    success: true,
    data: {
      movies: movies,
    },
  });
};

export const findMovieById = async (req, res, next) => {
  const { id } = req.params;

  const movie = await Movie.findById(id);
  if (!movie) return next(new AppError("Filmen kunde inte hittas", 404));

  res.status(200).json({
    success: true,
    data: movie,
  });
};

export const getMovieReviews = async (req, res, next) => {
  const { id } = req.params;

  const movie = await Movie.findById(id);
  if (!movie) return next(new AppError("Filmen kunde inte hittas", 404));

  const reviews = await Review.find({ movieId: id }).populate(
    "userId",
    "username"
  );

  res.status(200).json({
    success: true,
    data: {
      movie: {
        id: movie.id,
        title: movie.title,
        director: movie.director,
        releaseYear: movie.releaseYear,
      },
      reviews: reviews,
    },
  });
};

export const getMovieRating = async (req, res, next) => {
  const { id } = req.params;

  const movie = await Movie.findById(id);
  if (!movie) return next(new AppError("Filmen kunde inte hittas", 404));

  const rating = await Review.aggregate([
    { $match: { movieId: new ObjectId(id) } },
    {
      $group: {
        _id: "$movieId",
        avarageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (rating.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        movie: {
          id: movie.id,
          title: movie.title,
          director: movie.director,
          releaseYear: movie.releaseYear,
        },
        avarageRating: null,
        count: 0,
      },
    });
  }

  const { avarageRating, count } = rating[0];
  res.status(200).json({
    success: true,
    data: {
      movie: {
        id: movie.id,
        title: movie.title,
        director: movie.director,
        releaseYear: movie.releaseYear,
      },
      avarageRating: avarageRating,
      ratingCount: count,
    },
  });
};

// Endast admin kan lägga till filmer
export const addMovie = async (req, res, next) => {
  const { title, director, releaseYear, genre } = req.body;

  const genres = genre.map(capitalize);
  const movie = await Movie.create({
    title,
    director,
    releaseYear,
    genre: genres,
  });

  res.status(201).json({
    success: true,
    message: "Filmen har lagts till",
    data: movie,
  });
};

export const updateMovieById = async (req, res, next) => {
  const { id } = req.params;
  const update = req.body;

  if (update.genre && Array.isArray(update.genre)) {
    update.genre = update.genre.map(capitalize);
  }

  const movie = await Movie.findByIdAndUpdate(id, update, { new: true });
  if (!movie)
    return next(new AppError("Filmen som ska uppdateras kunde inte hittas", 404));

  res.status(200).json({
    success: true,
    message: "Filmen är uppdaterad",
    data: movie,
  });
};

export const deleteMovieById = async (req, res, next) => {
  const { id } = req.params;
  const deleted = await Movie.findByIdAndDelete(id);

  if (!deleted)
    return next(new AppError("Filmen som ska tas bort kunde inte hittas", 404));

  res.status(200).json({
    success: true,
    message: "Filmen har tagits bort",
    data: {
      deleted: deleted.title,
    },
  });
};
