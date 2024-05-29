import mongoose from "mongoose";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import User from "../models/User.js";
import { GenerateToken } from "../helpers/token.js";

export const signup = async (req, res) => {
  console.log("signup controller");
  console.log(req.body, "===>>> req.body");
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "All Fields are required" });
    }
    // const salt = genSaltSync(10);
    // const hashedPassword = hashSync(password, salt)
    // return res.send(hashedPassword)

    const user = await User.findOne({ email: email });

    console.log(user, "====>> user");
    if (user) {
      return res
        .status(409)
        .json({ status: false, message: "User already exists" });
    } else {
      const user = await User.findOne({ name: name });
      if (user) {
        return res.status(409).json({
          status: false,
          message: "User already exists",
        });
      } else {
        const salt = genSaltSync(10);
        let doc;

        let { name, email, password } = req.body;
        const hashPassword = hashSync(password, salt);
        console.log(password, "====>> password");
        console.log(hashPassword, "====>> hashPassword");
        password = hashPassword;

        if (password?.length >= 6) {
          doc = new User({
            name,
            email,
            password,
          });
          console.log(doc, "====>> doc");

          let savedUser = await doc.save();

          if (savedUser.errors) {
            return res
              .status(500)
              .json({ status: false, message: error.message, error });
          } else {
            // return res.send(savedUser);
            savedUser.password = undefined;
            // const token = GenerateToken({ data: user, expiresIn: "24h" });
            return res.status(201).json({
              status: true,
              message: "User Registartion Successful",
              // token,
              data: savedUser,
            });
          }
        } else {
          return res.status(403).json({
            status: false,
            message: "Email or Password is not valid",
          });
        }
      }
    }
  } catch (error) {
    // console.log(error.message, "====>>>error")
    return (
      res
        .status(500) //INTERNALERROR
        // .send(sendError({ status: false, message: error.message, error }));
        .send(error.message)
    );
  }
};

export const signin = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (name && password) {
      // return res.send("login controller")

      let user = await User.findOne({ name });
      console.log(user._id);
      // return
      if (user) {
        const isValid = compareSync(password, user.password);
        if (user.name === name && isValid) {
          user.password = undefined;
          const token = GenerateToken({ data: user._id, expiresIn: "24h" });
          res.cookie("access_token", token, { httpOnly: true });
          res.status(200).json({
            status: true,
            message: "Login Successful",
            token,
            data: user,
          });
        } else {
          return res.status(200).json({
            status: false,
            message: "Email or Password is not valid",
          });
        }
      } else {
        return res
          .status(404)
          .json({ status: false, message: "No User found" });
      }
    } else {
      return (
        res
          .status(500) //BADREQUEST
          // .send(sendError({ status: false, message: MISSING_FIELDS }));
          .send("Missing fields")
      );
    }
  } catch (error) {
    return res
      .status(500) //INTERNALERROR
      .send(error.message);
    // .send(
    //     sendError({
    //         status: false,
    //         message: error.message,
    //         data: null,
    //     })
    // );
  }
};

// user isUserloggedin
export const isUserLoggedIn = async (req, res) => {
  try {
    const userData = req.user;
    if (userData) {
      console.log(userData, "====>> userData");
      return res.status(200).json({
        status: true,
        message: "User is logged in",
        data: userData,
      });
    } else {
      console.log("User is not logged in");
    }
  } catch (error) {
    return res
      .status(500) //INTERNALERROR
      .send(error.message);
  }
};

export const googleAuth = (req, res) => {
  res.send("googleAuth");
};
