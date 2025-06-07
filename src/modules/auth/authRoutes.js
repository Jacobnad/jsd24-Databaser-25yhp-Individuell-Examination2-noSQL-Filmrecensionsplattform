import { Router } from "express";
import CatchAsync from "../../utils/CatchAsync.js";
import validate from "../../middleware/validate.js";
import { registerUser, loginUser, promoteUser } from "./authController.js";
import {
  registerUserSchema,
  loginUserSchema,
  userIdSchema,
} from "../../validation/userValidation.js";
import { authorization, restrictTo } from "../../middleware/authMiddleware.js";

const router = Router();

// Registrera ny användare med validering och asynkron hantering
router.post(
  "/register",
  validate(registerUserSchema, "body"),
  CatchAsync(registerUser)
);

// Logga in användare med validering
router.post("/login", validate(loginUserSchema, "body"), CatchAsync(loginUser));

// Endast admin får uppgradera annan användare till admin
router.patch(
  "/:id/promote",
  authorization,
  restrictTo("admin"),
  validate(userIdSchema, "params"),
  CatchAsync(promoteUser)
);

export default router;