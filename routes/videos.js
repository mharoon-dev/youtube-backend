import express from "express";
import {
  addVideo,
  deleteVideo,
  getVideo,
  updateVideo,
  addView,
  trend,
  random,
  sub,
  getByTag,
  search,

} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";
import { checkToken } from "../helpers/token.js";

const videoRouter = express.Router();

// add a video
// http://localhost:7000/api/videos
// post
videoRouter.post("/upload", checkToken, addVideo);

// update
// http://localhost:7000/api/videos/:id
// put
videoRouter.put("/:id", checkToken, updateVideo);

// delete
// http://localhost:7000/api/videos/:id
// delete
videoRouter.delete("/:id", checkToken, deleteVideo);

// get a video
// http://localhost:7000/api/videos/find/:id
// get
videoRouter.get("/find/:id", getVideo);

// view
// http://localhost:7000/api/videos/views/:id
// put
videoRouter.put("/views/:id", addView);

// trend
// http://localhost:7000/api/videos/trend
// get
videoRouter.get("/trend", trend);

// random
// http://localhost:7000/api/videos/random
// get
videoRouter.get("/random", random);

// sub
// http://localhost:7000/api/videos/sub
// get
videoRouter.get("/sub", checkToken, sub);

// tags
// http://localhost:7000/api/videos/tags
// get
videoRouter.get("/tags", getByTag);

// search
// http://localhost:7000/api/videos/search
// get
videoRouter.get("/search", search);

export default videoRouter;
