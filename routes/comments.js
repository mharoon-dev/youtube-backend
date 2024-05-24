import express from "express";
import { addComment, deleteComment, getComments } from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const commentsRouter = express.Router();

// add a comment
// http://localhost:7000/api/comments
// post
commentsRouter.post("/", verifyToken , addComment);

// delete a comment
// http://localhost:7000/api/comments/:id
// delete
commentsRouter.delete("/:id", verifyToken , deleteComment);

// get comments
// http://localhost:7000/api/comments/:videoId
// get
commentsRouter.get("/:videoId", verifyToken , getComments);

export default commentsRouter