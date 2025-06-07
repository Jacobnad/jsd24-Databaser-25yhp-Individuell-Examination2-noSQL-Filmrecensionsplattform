import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";
import AppError from "../utils/AppError.js";
import User from "../modules/auth/authModel.js";

// Middleware för att verifiera JWT och autentisera användaren
export const authorization = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    // Kontrollera om token finns och börjar med 'Bearer'
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("Åtkomst nekad – ingen token angiven", 401));
    }

    // Verifiera token och hitta aktuell användare
    const decoded = jwt.verify(token, jwtSecret);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(new AppError("Ingen användare hittades med angivet ID", 401));
    }

    // Lägger till användarinformation i request-objektet
    req.user = { id: currentUser._id, role: currentUser.role };
    next();
  } catch (error) {
    return next(new AppError("Token är ogiltig eller har gått ut", 401));
  }
};

// Middleware för att begränsa åtkomst till specifika roller
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Du har inte behörighet att utföra denna åtgärd", 403));
    }
    next();
  };
};
