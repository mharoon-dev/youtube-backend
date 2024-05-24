import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  console.log(req.headers);
  const token = await req.cookies.access_token;
  // console.log(req.cookies)
  // console.log(token + " ====>> token");

  if (!token) return next(createError(401, "you are not authenticated"));

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
    if (err) return next(createError(403, "Token is not valid"));
    // console.log(user.result);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
    const fetchUser = await User.findById(user.result);
    req.user = fetchUser;
    console.log(req.user + "====>> user (verify-Token_File)");
    next();
  });
};
