import express from "express";
import { addComment, deleteComment, getComments } from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";
import { checkToken } from "../helpers/token.js";

const commentsRouter = express.Router();

// add a comment
// http://localhost:7000/api/comments
// post
commentsRouter.post("/", checkToken , addComment);

// delete a comment
// http://localhost:7000/api/comments/:id
// delete
commentsRouter.delete("/:id", checkToken , deleteComment);

// get comments
// http://localhost:7000/api/comments/:videoId
// get
commentsRouter.get("/:videoId", checkToken , getComments);

export default commentsRouter