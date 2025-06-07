import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";
import AppError from "../utils/AppError.js";
import User from "../modules/auth/authModel.js";

export const authorization = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new AppError("Åtkomst nekad", 401));

    const decoded = jwt.verify(token, jwtSecret);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser)
      return next(new AppError("Det finns ingen användare med detta id", 401));

    req.user = { id: currentUser._id, role: currentUser.role };

    next();
  } catch (error) {
    return next(new AppError("Ogiltig eller utgången token", 401));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Du är ej behörig för denna åtgärd", 403));
    }
    next();
  };
};
