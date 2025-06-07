import { Router } from "express";
import CatchAsync from "../../utils/CatchAsync.js";
import { authorization, restrictTo } from "../../middleware/authMiddleware.js";
import validate from "../../middleware/validate.js";
import {
  movieSchema,
  updateMovieSchema,
  movieIdSchema,
} from "../../validation/movieValidation.js";
import {
  addMovie,
  getAllMovies,
  findMovieById,
  updateMovieById,
  deleteMovieById,
  getMovieReviews,
  getMovieRating,
} from "./movieController.js";

const router = Router();

//Get all movies
router.get("/", CatchAsync(getAllMovies));

//Get a movie by id
router.get(
  "/:id",
  validate(movieIdSchema, "params"),
  CatchAsync(findMovieById)
);

//Get a movie's reviews
router.get(
  "/:id/reviews",
  validate(movieIdSchema, "params"),
  CatchAsync(getMovieReviews)
);

//Get a movie's avarage rating
router.get(
  "/:id/ratings",
  validate(movieIdSchema, "params"),
  CatchAsync(getMovieRating)
);

//ADMIN ONLY
//Post a movie
router.post(
  "/",
  authorization,
  restrictTo("admin"),
  validate(movieSchema, "body"),
  CatchAsync(addMovie)
);

//Update a movie by id
router.put(
  "/:id",
  authorization,
  restrictTo("admin"),
  validate(movieIdSchema, "params"),
  validate(updateMovieSchema),
  CatchAsync(updateMovieById)
);

//Delete a movie by id
router.delete(
  "/:id",
  authorization,
  restrictTo("admin"),
  validate(movieIdSchema, "params"),
  CatchAsync(deleteMovieById)
);

export default router;
