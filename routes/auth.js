import express from "express";
import {
  googleAuth,
  isUserLoggedIn,
  signin,
  signup,
} from "../controllers/auth.js";
import { verifyToken } from "../verifyToken.js";
import { checkToken } from "../helpers/token.js";

const authRouter = express.Router();

// signup
// http://localhost:7000/api/auth/signup
// post
authRouter.post("/signup", signup);

// signin
// http://localhost:7000/api/auth/signin
// post
authRouter.post("/signin", signin);

// isUserLoggedIn
// http://localhost:7000/api/auth/isuserloggedin
// get
authRouter.get("/isuserloggedin", checkToken, isUserLoggedIn);

// signin with google
authRouter.post("/signinwithgoogle", googleAuth);

export default authRouter;
