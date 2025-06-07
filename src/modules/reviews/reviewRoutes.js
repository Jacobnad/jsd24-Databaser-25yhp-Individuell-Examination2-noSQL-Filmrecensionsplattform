import { Router } from "express";
import { authorization } from "../../middleware/authMiddleware.js";
import validate from "../../middleware/validate.js";
import CatchAsync from "../../utils/CatchAsync.js";
import {
  reviewSchema,
  updateReviewSchema,
  reviewIdSchema,
} from "../../validation/reviewValidation.js";
import {
  getAllReviews,
  findReviewById,
  addReview,
  updateReviewById,
  deleteReviewById,
} from "./reviewController.js";

const router = Router();

//Get all reviews
router.get("/", CatchAsync(getAllReviews));

//Get details for a review by id
router.get(
  "/:id",
  validate(reviewIdSchema, "params"),
  CatchAsync(findReviewById)
);

//Post a review
router.post(
  "/",
  authorization,
  validate(reviewSchema, "body"),
  CatchAsync(addReview)
);

//Update a review by id
router.put(
  "/:id",
  authorization,
  validate(reviewIdSchema, "params"),
  validate(updateReviewSchema, "body"),
  CatchAsync(updateReviewById)
);

//Delete a review by id
router.delete(
  "/:id",
  authorization,
  validate(reviewIdSchema, "params"),
  CatchAsync(deleteReviewById)
);

export default router;
