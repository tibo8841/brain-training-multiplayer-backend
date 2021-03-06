const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server, Socket } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();
let PORT = process.env.PORT || 3001;

corsSettings = {
  allowedHeaders: [
    "Authorization",
    "Content-Type",
    "Accept",
    "Origin",
    "User-Agent",
  ],
  origin: [
    "http://localhost:3000",
    "https://brain-training-website.sigmalabs.co.uk",
  ],
  credentials: true,
  methods: ["GET", "POST"],
};

app.use(cors(corsSettings));

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsSettings,
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(
      `User ${data.username} with ID: ${socket.id} joined room: ${data.room}`
    );
    socket.broadcast.emit("join_room", data);
  });

  socket.on("send_play", (data) => {
    socket.broadcast.emit("receive_play", data);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("send_score", (data) => {
    socket.broadcast.emit("receive_score", data);
    console.log(data, "receiving messages is also happening (backend)");
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("SERVER RUNNING ON " + PORT);
});
