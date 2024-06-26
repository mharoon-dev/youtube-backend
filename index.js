import express from "express";
import { connectDB } from "./config/default.js";
import userRouter from "./routes/users.js";
import commentsRouter from "./routes/comments.js";
import videoRouter from "./routes/videos.js";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173" ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/videos", videoRouter);

app.post("/api/videos/uploads");

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is Running at http://localhost:${process.env.PORT}`);
});
