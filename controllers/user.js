import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
// update a user
export const update = async (req, res, next) => {
  // console.log(req.user.result._id)
  if (req.params.id === req.user._id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

// delete a user
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user._id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

// get a user
export const getaUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// subscribe
export const subscribe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      // logged in user
      $push: { subscribedUsers: req.params.id }, // jis ko subscribe karna hai
    });

    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 }, // jis ko subscribe karna hai
    });

    res.status(200).json("Subscription successfull.");
  } catch (error) {
    res.status(500).json(error);
  }
};

// unSubscribe
export const unSubscribe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      // logged in user
      $pull: { subscribedUsers: req.params.id }, // jis ko subscribe karna hai
    });

    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 }, // jis ko subscribe karna hai
    });

    res.status(200).json("UnSubscription successfull.");
  } catch (error) {
    res.status(500).json(error);
  }
};

// likeVideo
export const likeVideo = async (req, res, next) => {
  const id = req.user._id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });

    res.status(200).json("The video has been liked.");
  } catch (error) {
    next(error);
  }
};

// disLikeVideo
export const disLikeVideo = async (req, res, next) => {
  try {
    const id = req.user._id;
    const videoId = req.params.videoId;
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    });
    res.status(200).json("The video has been disliked.");
  } catch (error) {
    next(error);
  }
};
