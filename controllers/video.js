import { createError } from "../error.js";
import Video from "../models/Video.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

    // Upload image to Cloudinary
    const uploadToCloudinary = (fileBuffer, options) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
    };

    try {
      const imageFile = req.files["image"][0];
      const videoFile = req.files["video"][0];

      const imageResult = await uploadToCloudinary(imageFile.buffer, { public_id: imageFile.originalname });
      const videoResult = await uploadToCloudinary(videoFile.buffer, { resource_type: "video" });

      const newVideo = new Video({
        userId: req.user._id,
        imgUrl: imageResult.secure_url,
        videoUrl: videoResult.secure_url,
        desc: desc,
        title: title,
        tags: tags,
      });

      const savedVideo = await newVideo.save();
      res.status(200).json(savedVideo);
    } catch (error) {
      next(error);
    }
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
