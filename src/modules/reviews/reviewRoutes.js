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

// Hämta alla recensioner (öppen access)
router.get("/", CatchAsync(getAllReviews));

// Hämta recension via ID
router.get(
  "/:id",
  validate(reviewIdSchema, "params"),
  CatchAsync(findReviewById)
);

// Lägg till recension (kräver inloggning)
router.post(
  "/",
  authorization,
  validate(reviewSchema, "body"),
  CatchAsync(addReview)
);

// Uppdatera recension via ID (kräver inloggning)
router.put(
  "/:id",
  authorization,
  validate(reviewIdSchema, "params"),
  validate(updateReviewSchema, "body"),
  CatchAsync(updateReviewById)
);

// Radera recension via ID (kräver inloggning)
router.delete(
  "/:id",
  authorization,
  validate(reviewIdSchema, "params"),
  CatchAsync(deleteReviewById)
);

export default router;
