import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  const token = await req.cookies.access_token;
  // console.log(token + " ====>> token");

  if (!token) return next(createError(401, "you are not authenticated"));

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return next(createError(403, "Token is not valid"));
    req.user = user;
    // console.log(user);
    next();
  });
};
