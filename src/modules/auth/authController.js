import jwt from "jsonwebtoken";
import { jwtSecret, tokenExpiry } from "../../config/config.js";
import AppError from "../../utils/AppError.js";
import User from "./authModel.js";

// Skapar en JWT-token med användarens ID och roll
const signToken = (id, role) =>
  jwt.sign({ id, role }, jwtSecret, { expiresIn: tokenExpiry });

// Registrera ny användare
export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return next(
      new AppError(
        "E-postadress eller användarnamn är redan registrerat.",
        409
      )
    );
  }

  const user = await User.create({ username, email, password });
  const token = signToken(user.id, user.role);

  res.status(201).json({
    success: true,
    message: "Användaren har skapats",
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
};

// Logga in användare
export const loginUser = async (req, res, next) => {
  const { email, username, password } = req.body;

  const credentials = email ? { email } : { username };
  const user = await User.findOne(credentials).select("+password");

  const validPassword = user && (await user.correctPassword(password));
  if (!validPassword) {
    return next(new AppError("Felaktiga inloggningsuppgifter", 401));
  }

  const token = signToken(user.id, user.role);

  res.status(200).json({
    success: true,
    message: "Inloggning lyckades",
    token,
  });
};

// Uppgradera användare till admin (endast adminåtkomst)
export const promoteUser = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("Användaren kunde inte hittas", 404));
  }

  user.role = "admin";
  await user.save();

  res.status(200).json({
    success: true,
    message: "Användaren har uppgraderats till admin",
    data: user,
  });
};
