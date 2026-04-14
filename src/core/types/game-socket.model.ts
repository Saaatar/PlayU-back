import type { Socket } from "socket.io";

export interface GameSocket extends Socket {
  roomCode?: string;
}
