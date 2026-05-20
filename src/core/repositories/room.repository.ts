import { v4 } from "uuid";
import type { Room } from "../types/room.model.js";
import type { RoomState } from "../types/room.state.model.js";

export class RoomRepository {
  rooms: Map<string, RoomState>;

  constructor() {
    this.rooms = new Map<string, RoomState>();
  }

  public create(room: RoomState): void {
    this.rooms.set(room.code, room);
  }

  public findByCode(id: string): RoomState | undefined {
    return this.rooms.get(id);
  }

  public update(room: RoomState): void {
    this.rooms.set(room.code, room);
  }
}
