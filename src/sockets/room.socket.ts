import { Server } from "socket.io";
import { RoomService } from "../core/services/room.service.js";
import type { GameSocket } from "../core/types/game-socket.model.js";
import { PlayuEvents } from "../core/types/playu.states.machine.js";
import { SocketEvents } from "./types/socket.events.models.js";

export class RoomSocketHandler {
  constructor(
    private io: Server,
    private socket: GameSocket,
    private roomService: RoomService
  ) {
    this.setupEvents();
  }

  private setupEvents(): void {
    this.socket.on(SocketEvents.ROOM_JOIN, this.handleJoin);
    this.socket.on(SocketEvents.DISCONNECT, this.handleDisconnect);
    this.socket.on(SocketEvents.GAME_START, () => {
      this.dispatchToRoom(PlayuEvents.START_GAME);
    });
    this.socket.on(SocketEvents.GAME_END_MINI, () => {
      this.dispatchToRoom(PlayuEvents.END_MINIGAME);
    });
    this.socket.on(SocketEvents.GAME_NEXT, () => {
      if (this.socket.roomCode) {
        this.roomService.advanceGame(this.socket.roomCode);
      }
    });
  }

  private handleJoin = (data: { code: string; username: string }): void => {
    try {
      const room = this.roomService.join(data.code, this.socket.id, data.username);
      this.socket.join(data.code);

      this.socket.roomCode = data.code;

      this.io.to(data.code).emit(SocketEvents.ROOM_UPDATE, {
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
        this.io.to(code).emit(SocketEvents.ROOM_UPDATE, {
          code: room.code,
          players: room.players,
        });
      }
    }
    console.log(`User left: ${this.socket.id}`);
  };

  private dispatchToRoom(event: PlayuEvents) {
    if (this.socket.roomCode) {
      this.roomService.triggerEvent(this.socket.roomCode, event);
    }
  }
}
