import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

let io;

const userSocketMap = new Map();

export const initSocketServer = (server, CLIENT_URL) => {
  io = new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "development"
          ? "http://localhost:5173"
          : CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {

    addSocketToUser(socket.user, socket);
    emitOnlineUsers();

  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
    console.log(`Usuario ${socket.user._id} unido a ${chatId}`);
  });

  socket.on("leave-chat", (chatId) => {
    socket.leave(chatId);
    console.log(`Usuario ${socket.user._id} salió de ${chatId}`);
  });

socket.on("typing", ({ chatId }) => {
  console.log(`Usuario ${socket.user._id} está escribiendo en ${chatId}`);
  socket.to(chatId).emit("typing", {
    user: socket.user
  });
});

socket.on("stopTyping", ({ chatId }) => {
  console.log(`Usuario ${socket.user._id} dejó de escribir en ${chatId}`);
  socket.to(chatId).emit("stopTyping", {
    user: socket.user
  });
});



    


    socket.on("disconnect", () => {
      removeSocketFromUser(socket.user, socket);
      emitOnlineUsers();
      console.log("Usuario desconectado", socket.user.fullName);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket no inicializado");
  return io;
};


const addSocketToUser = (user, socket) => {
  const userId = user._id.toString()|| user.id.toString();
  if (!userSocketMap.has(userId)) {
    userSocketMap.set(userId, []);
  }
  userSocketMap.get(userId).push(socket.id);
};

const removeSocketFromUser = (user, socket) => {
  const userId = user._id.toString()|| user.id.toString();
  const sockets = userSocketMap.get(userId) || [];

  const updated = sockets.filter((id) => id !== socket.id);

  if (updated.length === 0) {
    userSocketMap.delete(userId);
  } else {
    userSocketMap.set(userId    , updated);
  }
};

const emitOnlineUsers = () => {
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
};