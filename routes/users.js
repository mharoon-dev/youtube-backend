import express from "express";
import {
  deleteUser,
  disLikeVideo,
  getaUser,
  likeVideo,
  subscribe,
  unSubscribe,
  update,
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";
import { checkToken } from "../helpers/token.js";

const userRouter = express.Router();

// update user
// http://localhost:7000/api/users/:id
// put
userRouter.put("/:id", checkToken, update);

// delete user
// http://localhost:7000/api/users/:id
// delete
userRouter.delete("/:id", checkToken, deleteUser);

// get a user
// http://localhost:7000/api/users/find/:id
// get
userRouter.get("/find/:id", getaUser);

// subscribe a user
// http://localhost:7000/api/users/sub/:id
// put
userRouter.put("/sub/:id", checkToken, subscribe);

// unSubscribe a user
// http://localhost:7000/api/users/unsub/:id
// put
userRouter.put("/unsub/:id", checkToken, unSubscribe);

// like a video
// http://localhost:7000/api/users/like/:videoId
// put
userRouter.put("/like/:videoId", checkToken, likeVideo);

// disLike a video
// http://localhost:7000/api/users/dislike/:videoId
// put
userRouter.put("/dislike/:videoId", checkToken, disLikeVideo);

export default userRouter;
