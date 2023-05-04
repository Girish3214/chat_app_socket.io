import { Server } from "socket.io";

const io = new Server({ cors: { origin: "http://localhost:5173" } });

let onlineUsers = [];
io.on("connection", (socket) => {
  console.log("server is running in ", socket.id);

  // add user when they are online
  socket.on("addNewUser", (userId) => {
    const isAlreadyOnline = onlineUsers.some((user) => user.userId === userId);
    if (!isAlreadyOnline) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }
    io.emit("getOnlineUsers", onlineUsers);
    console.log("onlineUsers:", onlineUsers);
  });

  // add message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
