const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
  credentials: true,
  preflightContinue: false,
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
};

const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));

const botName = "Aleks";

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("joinRoom", ({ surname, room }) => {
    const user = userJoin(socket.id, surname, room);

    socket.join(user.room);

    socket.emit(
      "message",
      formatMessage(botName, `Welcome to your ${user.roomName} Chatroom!`)
    );

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.surname} has joined the chat`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    console.log(user);

    io.in(user.room).emit("message", formatMessage(user.surname, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.surname} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
