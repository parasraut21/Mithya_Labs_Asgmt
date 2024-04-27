const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
const User = require("./models/userModel");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", async (userId) => {
    onlineUsers.set(userId, socket.id);

    // Update user's online status to true in the user collection
    await User.findByIdAndUpdate(userId, { $set: { online: true } });

    // Emit an event to inform other clients that the user is online
    socket.broadcast.emit("userOnline", { userId, online: true });
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });


  // Handle user disconnection
  socket.on("disconnect", async () => {
    console.log("User disconnected");

    const userIdToRemove = getKeyByValue(onlineUsers, socket.id);
    if (userIdToRemove) {
      onlineUsers.delete(userIdToRemove);
      console.log(`User disconnected: ${userIdToRemove}`);

      // Update user's online status to false in the user collection
      await User.findByIdAndUpdate(userIdToRemove, { $set: { online: false } });

      // Emit an event to inform other clients that the user is offline
      socket.broadcast.emit("userOffline", { userId: userIdToRemove, online: false });
    }
  });

  socket.on("typing", (data) => {
    console.log("typing to - ", data.username ,"----",data._id)
    socket.broadcast.emit("typing..", { _id: data._id, isTyping: true });


  })

  socket.on("stopTyping", (data) => {
    console.log("stop typing to - ", data.username ,"----",data._id)
    socket.broadcast.emit("typing..", { _id: data._id, isTyping: false });
  });

  socket.on("disconnectMian", (id) => {
    socket.broadcast.emit("userOffline", { userId: id, online: false });
  });
});


// Utility function to get key by value in a Map
function getKeyByValue(map, value) {
  for (let [key, val] of map.entries()) {
    if (val === value) {
      return key;
    }
  }
  return null;
}
