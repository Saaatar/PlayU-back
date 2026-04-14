import { RoomRepository } from "../../core/repositories/room.repository.js";
import { RoomService } from "../../core/services/room.service.js";
import type { Request, Response } from "express";

export class RoomController {
  constructor(private roomService: RoomService) {}

  public create = async (req: Request, res: Response) => {
    try {
      const room = this.roomService.createRoom();
      res.status(201).json(room);
    } catch {
      res.status(500).json({ message: "Error creating room" });
    }
  };
}
