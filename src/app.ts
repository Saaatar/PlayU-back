import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { RoomRepository } from "./core/repositories/room.repository.js";
import { RoomService } from "./core/services/room.service.js";
import { roomRouter } from "./api/routes/v1/room.routes.js";
import { RoomSocketHandler } from "./sockets/room.socket.js";
import type { CorsOptions } from "cors";
import cors from "cors";

const PORT = process.env.PORT || 3000;

const corsOptions: CorsOptions = { origin: "*" };

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: corsOptions });

const roomRepo = new RoomRepository();
const roomService = new RoomService(roomRepo);

app.use("/api/v1/room", roomRouter(roomService));

io.on("connection", (socket) => {
  new RoomSocketHandler(io, socket, roomService);
});

const main = async () => {
  try {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Start server error: ${error}`);
  }
};

main();
