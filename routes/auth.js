import express from "express";
import { googleAuth, signin, signup } from "../controllers/auth.js";

const authRouter = express.Router();

// signup
// http://localhost:7000/api/users/signup
// post
authRouter.post("/signup",signup )

// signin
// http://localhost:7000/api/users/signin
// post
authRouter.post("/signin", signin)

// signin with google
authRouter.post("/signinwithgoogle", googleAuth)

export default authRouter;
