import { Router } from "express";
import { RoomController } from "../../controllers/room.controller.js";
import { RoomService } from "../../../core/services/room.service.js";

export const roomRouter = (RoomService: RoomService) => {
  const router = Router();
  const roomController = new RoomController(RoomService);

  router.post("/", roomController.create);

  return router;
};
