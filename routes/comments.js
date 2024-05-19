import express from "express";
import { addComment, deleteComment, getComments } from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const commentRouter = express.Router();

// add a comment
// http://localhost:7000/api/comments
// post
commentRouter.post("/", verifyToken , addComment);

// delete a comment
// http://localhost:7000/api/comments/:id
// delete
commentRouter.delete("/:id", verifyToken , deleteComment);

// get comments
// http://localhost:7000/api/comments/:videoId
// get
commentRouter.get("/:videoId", verifyToken , getComments);

export default commentRouter