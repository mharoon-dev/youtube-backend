import express from "express";
import { connectDB } from "./config/default.js";
import userRouter from "./routes/users.js";
import commentRouter from "./routes/Comments.js";
import videoRouter from "./routes/videos.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);
app.use("/api/users", videoRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
})

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is Running at http://localhost:${process.env.PORT}`);
});
