import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./utils/db.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import predictRouter from "./routes/predict.js";
import newsRouter from "./routes/news.js";
import portfolioRouter from "./routes/portfolio.js";
import advisorRouter from "./routes/advisor.js";
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);
app.use(morgan("dev"));
app.use(rateLimiter({ windowMs: 60_000, max: 20 }));

await connectDB();

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/predict", predictRouter);
app.use("/news", newsRouter);
app.use("/portfolio", portfolioRouter);
app.use("/advisor", advisorRouter);
app.use("/user", userRouter);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
});

const communityMessages = [];

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Send existing messages to the new user
  socket.emit("initial_messages", communityMessages.slice(-50));

  socket.on("send_message", (data) => {
    const newMessage = {
      id: Date.now(),
      text: data.text,
      user: data.user, // { id, name, wallet }
      timestamp: new Date().toISOString(),
    };
    communityMessages.push(newMessage);
    if (communityMessages.length > 100) communityMessages.shift(); // Keep last 100
    io.emit("new_message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`backend listening on :${port}`);
});
