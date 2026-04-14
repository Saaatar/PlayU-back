import { v4 } from "uuid";
import type { Room } from "../types/room.model.js";

export class RoomRepository {
  rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map<string, Room>();
  }

  public create(room: Room): void {
    this.rooms.set(room.code, room);
  }

  public findByCode(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  public update(room: Room): void {
    this.rooms.set(room.code, room);
  }
}
