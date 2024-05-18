import { createError } from "../error.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

// add a video
export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.result._id, ...req.body });

  try {
    const savedVideo = await newVideo.save();
    res.status(200);
    res.json(savedVideo);
  } catch (error) {
    next(error);
  }
};

// add a video
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) return next(createError(404, "Video not found"));

    if (req.user.result._id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200);
      res.json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your video"));
    }
  } catch (error) {
    next(error);
  }
};

// add a video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) return next(createError(404, "Video not found"));

    if (req.user.result._id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200);
      res.json("the video has been deleted");
    } else {
      return next(createError(403, "You can delete only your video"));
    }
  } catch (error) {
    next(error);
  }
};

// add a video
export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) return next(createError(404, "Video not found"));

    res.status(200);
    res.json(video);
  } catch (error) {
    next(error);
  }
};

// add view
export const addView = async (req, res) => {
  try {
    await Video.findByIdandUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.status(200);
    res.json("the view has been increased");
  } catch (error) {
    next(error);
  }
};

// random
export const random = async (req, res) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);

    res.status(200);
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// trend
export const trend = async (req, res) => {
  try {
    const videos = await Video.find().sort({ views: -1 });

    res.status(200);
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// sub
export const sub = async (req, res) => {
  try {
    const user = await User.findById(req.user.result._id);
    
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {              // jis ko mene subscribe kia hai us ke channel ki id
        return await Video.find({ userId: channelId });  
      })
    );

    res.status(200);
    res.json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
};
