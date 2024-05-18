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

const userRouter = express.Router();

// update user
// http://localhost:7000/api/users/:id
// put
userRouter.put("/:id", verifyToken, update);

// delete user
// http://localhost:7000/api/users/:id
// delete
userRouter.delete("/:id", verifyToken, deleteUser);

// get a user
// http://localhost:7000/api/users/find/:id
// get
userRouter.get("/find/:id", getaUser);

// subscribe a user
// http://localhost:7000/api/users/sub/:id
// put
userRouter.put("/sub/:id", verifyToken, subscribe);

// unSubscribe a user
// http://localhost:7000/api/users/unsub/:id
// put
userRouter.put("/unsub/:id", verifyToken, unSubscribe);

// like a video
// http://localhost:7000/api/users/like/:videoId
// put
userRouter.put("/like/:videoId", verifyToken, likeVideo);

// disLike a video
// http://localhost:7000/api/users/dislike/:videoId
// put
userRouter.put("/dislike/:videoId", verifyToken, disLikeVideo);

export default userRouter;
