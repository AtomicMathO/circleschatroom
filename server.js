require("dotenv").config();
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const controllerChat = require("./app/controller/controllerChat");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getdbIdBysocketId,
} = require("./utils/users");

const router = require("./app/router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//ejs
app.set("view engine", "ejs");
app.set("views", "./public/views");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(router);

const trackUser = new Array();
const botName = "Aleks";

// Run when client connects
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("joinRoom", ({ surname, user_id, room }) => {
    io.on("connection", function (socket) {});

    const user = userJoin(socket.id, user_id, surname, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit(
      "message",
      formatMessage(botName, "Welcome to your Circle Chatroom!")
    );

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.surname} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    controllerChat.sendMessageToDB(msg, socket.id, user.room);

    io.in(user.room).emit("message", formatMessage(user.surname, msg));
    console.log(msg);
  });

  // Runs when client disconnects
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

const PORT = process.env.PORT || 5555;

server.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
