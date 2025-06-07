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

router.post(
  "/register",
  validate(registerUserSchema, "body"),
  CatchAsync(registerUser)
);

router.post("/login", validate(loginUserSchema, "body"), CatchAsync(loginUser));

//ADMIN ONLY:
router.patch(
  "/:id/promote",
  authorization,
  restrictTo("admin"),
  validate(userIdSchema, "params"),
  CatchAsync(promoteUser)
);
export default router;
