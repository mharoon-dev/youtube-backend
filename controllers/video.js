import { createError } from "../error.js";
import Video from "../models/Video.js";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
const upload = multer({ dest: "./public/data/uploads/" });

// Configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.CLOUDINARY_SECRET,
});

dotenv.config();

// add a video
export const addVideo = async (req, res, next) => {
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ])(req, res, async function (err) {
    if (err) {
      // Handle any errors related to file upload
      return next(err);
    }

    const { title, desc } = req.body;
    const tags = req.body.tags.split(",");

    console.log(req.files); // Check the uploaded files in console

    // Assuming both image and video files are uploaded
    const imageFile = req.files["image"][0];
    const videoFile = req.files["video"][0];

    // Upload image to Cloudinary
    cloudinary.uploader.upload(
      imageFile.path,
      { public_id: imageFile.filename },
      async function (error, imageResult) {
        // Check for Cloudinary upload error
        if (error) {
          return next(error);
        }

        console.log(imageResult, "===>>> Image result");

        // Upload video to Cloudinary
        cloudinary.uploader.upload(
          videoFile.path,
          { resource_type: "video" },
          async function (videoError, videoResult) {
            // Check for Cloudinary upload error
            if (videoError) {
              return next(videoError);
            }

            console.log(videoResult, "===>>> Video result");

            console.log(req.body);

            const newVideo = new Video({
              userId: req.user._id,
              imgUrl: imageResult.secure_url,
              videoUrl: videoResult.secure_url,
              desc: desc,
              title: title,
              tags: tags,
            });

            try {
              const savedVideo = await newVideo.save();
              res.status(200).json(savedVideo);
            } catch (error) {
              next(error);
            }
          }
        );
      }
    );
  });
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
export const deleteVideo = async (req, res, next) => {
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
export const getVideo = async (req, res, next) => {
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
export const addView = async (req, res, next) => {
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
export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);

    res.status(200);
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// trend
export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });

    res.status(200);
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// sub
export const sub = async (req, res, next) => {
  try {
    const user = req.user;
    // console.log(user);

    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        // jis ko mene subscribe kia hai us ke channel ki id
        return await Video.find({ userId: channelId });
      })
    );

    res.status(200);
    res.json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
};

// tags
export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  console.log(tags);

  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    console.log(videos);
    res.status(200);
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// search
export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    });
    res.status(200);
    res.json(videos);
  } catch (error) {
    next(error);
  }
};
