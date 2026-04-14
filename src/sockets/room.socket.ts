import { Server } from "socket.io";
import { RoomService } from "../core/services/room.service.js";
import type { GameSocket } from "../core/types/game-socket.model.js";

export class RoomSocketHandler {
  constructor(
    private io: Server,
    private socket: GameSocket,
    private roomService: RoomService
  ) {
    this.setupEvents();
  }

  private setupEvents(): void {
    this.socket.on("room:join", this.handleJoin);
    this.socket.on("disconnect", this.handleDisconnect);
  }

  private handleJoin = (data: { code: string; username: string }): void => {
    try {
      const room = this.roomService.join(data.code, this.socket.id, data.username);
      this.socket.join(data.code);

      this.socket.roomCode = data.code;

      this.io.to(data.code).emit("room:update", {
        code: data.code,
        players: room.players,
      });
    } catch (error) {
      this.socket.emit("error", "Can't join to room");
    }
  };

  private handleDisconnect = (): void => {
    const code = this.socket.roomCode;

    if (code) {
      const room = this.roomService.leave(code, this.socket.id);

      if (room) {
        this.io.to(code).emit("room:update", {
          code: room.code,
          players: room.players,
        });
      }
    }
    console.log(`User left: ${this.socket.id}`);
  };
}
