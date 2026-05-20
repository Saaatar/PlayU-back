import { RoomRepository } from "../repositories/room.repository.js";
import type { Room } from "../types/room.model.js";
import { v4 } from "uuid";
import { RoomState } from "../types/room.state.model.js";
import type { PlayuEvents } from "../types/playu.states.machine.js";

export class RoomService {
  private globalCatalog: string[] = [];
  constructor(private roomRepo: RoomRepository) {}

  public createRoom(): RoomState {
    const code = v4().substring(0, 6).toUpperCase();
    const newRoom = new RoomState(code);
    this.roomRepo.create(newRoom);
    return newRoom;
  }

  public join(code: string, playerId: string, username: string): RoomState {
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

  public setGlobalCatalog(gameCatalog: string[]): void {
    this.globalCatalog = gameCatalog;
  }

  public getGlobalCatalog(): string[] {
    return this.globalCatalog;
  }

  public setBroadcastCallback(code: string, callback: (ev: string, p: any) => void) {
    const room = this.roomRepo.findByCode(code);
    if (room) room.broadcast = callback;
  }

  public triggerEvent(code: string, event: PlayuEvents) {
    const room = this.roomRepo.findByCode(code);
    if (room) {
      room.changeEvent(event);
      this.roomRepo.update(room);
    }
  }

  public advanceGame(code: string): void {
    const room = this.roomRepo.findByCode(code);

    if (room) {
      const eventToDispatch = room.getNextEvent();

      room.changeEvent(eventToDispatch);
      this.roomRepo.update(room);
    }
  }
}
