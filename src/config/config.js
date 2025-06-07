import dotenv from "dotenv";

// Ladda miljövariabler från .env-filen
dotenv.config();

// Kontrollera att JWT-secret finns definierad (avkommentera vid behov)
// if (!process.env.JWT_SECRET) {
//   throw new Error("JWT_SECRET saknas i .env-filen");
// }

const jwtSecret = process.env.JWT_SECRET;

// Standardvärde används om JWT_EXPIRY inte är satt
const tokenExpiry = process.env.JWT_EXPIRY ?? "1h";

export { jwtSecret, tokenExpiry };
