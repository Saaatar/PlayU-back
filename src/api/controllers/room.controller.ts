import { RoomRepository } from "../../core/repositories/room.repository.js";
import { RoomService } from "../../core/services/room.service.js";
import type { Request, Response } from "express";

export class RoomController {
  constructor(private roomService: RoomService) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const room = this.roomService.createRoom();
      res.status(201).json(room);
    } catch {
      res.status(500).json({ message: "Error creating room" });
    }
  };

  public saveCatalog = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gamesCatalog } = req.body as { gamesCatalog: string[] };

      if (!gamesCatalog || !Array.isArray(gamesCatalog)) {
        res.status(400).json({ message: "gamesCatalog es requerido y debe ser un arreglo" });
        return;
      }

      // Guardamos la información directamente en el servicio
      this.roomService.setGlobalCatalog(gamesCatalog);

      res.status(200).json({ message: "Catálogo sincronizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al guardar el catálogo en el servidor" });
    }
  };
}
