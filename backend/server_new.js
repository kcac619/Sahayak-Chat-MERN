import express from "express";
import dotenv from "dotenv";
import chats from "./data/data.js";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";
import path from "path";

const app = express();
dotenv.config();
connectDB();

app.use(express.json()); //to accept json data

const corsOptions = {
  origin: "https://sahayak-chat-mern.onrender.com",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// app.get("/", (req, res) => {
//   res.send("API running successfully");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------DEPLOYMENT------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API running successfully");
  });
}

// ------------DEPLOYMENT---------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 6500;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // console.log(chats);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", ({ chatId, userId }) => {
    socket.join(chatId);
    console.log(`${userId} joined chat ${chatId}`);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.to(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
