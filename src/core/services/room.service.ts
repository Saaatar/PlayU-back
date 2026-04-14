import { RoomRepository } from "../repositories/room.repository.js";
import type { Room } from "../types/room.model.js";
import { v4 } from "uuid";

export class RoomService {
  constructor(private roomRepo: RoomRepository) {}

  public createRoom(): Room {
    const code = v4().substring(0, 6).toUpperCase();
    const newRoom: Room = {
      code: code,
      players: [],
    };

    this.roomRepo.create(newRoom);
    return newRoom;
  }

  public join(code: string, playerId: string, username: string): Room {
    const room = this.roomRepo.findByCode(code);
    if (!room) throw new Error("Room not found");
    if (room.players.length >= 4) throw new Error("Max players in the room");

    if (!room.players.find((p) => p.id === playerId)) {
      room.players.push({ id: playerId, username });
      this.roomRepo.update(room);
    }
    return room;
  }

  public leave(code: string, playerId: string) {
    const room = this.roomRepo.findByCode(code);
    if (room) {
      room.players = room.players.filter((p) => p.id !== playerId);
      this.roomRepo.update(room);
      return room;
    }
    return null;
  }
}
