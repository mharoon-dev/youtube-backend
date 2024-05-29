import pkg from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const { sign, verify } = pkg;

export const GenerateToken = ({ data, expiresIn }) => {
  return sign({ result: data }, process.env.JWT_SECRET_KEY, {
    expiresIn: expiresIn,
  });
};

// export const VerifyToken = (token) => {
//   return verify(token, process.env.JWT_SECRET_KEY);
// };

// export const ValidateToken = ({ token, key }) => {
//   return verify(token, key);
// };

// export const validateToken = async (req, res, next) => {
//   let token;
//   const { authorization } = req.headers;
//   console.log(authorization, "===>>authorization");
//   if (authorization && authorization.startsWith("Bearer")) {
//     try {
//       // Get Token from header
//       token = authorization.split(" ")[1];
//       console.log(token, "====>>token");
//       // Verify Token
//       const { result } = verify(token, process.env.JWT_SECRET_KEY);
//       // Get User from Token
//       console.log(result, "====>>result");
//       req.user = result;
//       next();
//     } catch (error) {
//       console.log(error, "===>>error");
//       res.status(401).send({ status: "failed", message: "Unauthorized User" });
//     }
//   }
//   if (!token) {
//     res
//       .status(401)
//       .send({ status: "failed", message: "Unauthorized User, No Token" });
//   }
// };

export const checkToken = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // Get Token from header
      token = authorization.split(" ")[1];
      // Verify Token
      const { result } = verify(token, process.env.JWT_SECRET_KEY);

      const fetchUser = await User.findById(result);
      req.user = fetchUser;
      console.log(req.user + "====>> user (validation-Token_File)");
      
      req.user = fetchUser;
      next();
    } catch (error) {
      res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
  }
  if (!token) {
    console.log("no login user");
    next();
  }
};
