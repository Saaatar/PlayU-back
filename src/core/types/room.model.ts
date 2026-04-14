import type { Player } from "./player.model.js";

export interface Room {
  code: string;
  name?: string;
  players: Player[];
}
