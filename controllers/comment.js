import { createError } from "../error.js";
import Comment from "../models/Comment.js";

// add a comment
export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.result._id });
  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (error) {
    next(error);
  }
};

// delete comment
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const video = await Video.findById(req.params.id);
    if (
      comment.userId === req.user.result._id ||
      req.user.result._id === video.userId
    ) {
      await comment.findByIdAndDelete(req.params.id);
      res.status(200).json("the comment has been deleted");
    } else {
      return next(createError(403, "You can delete only your comment"));
    }
  } catch (error) {
    next(error);
  }
};
// add a comment
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};
