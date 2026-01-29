import { Router } from "express";
import * as automationsController from "../controllers/automationsController";

const router = Router();

router.get("/", automationsController.list);
router.post("/", automationsController.create);
router.get("/:id", automationsController.getById);
router.put("/:id", automationsController.update);
router.delete("/:id", automationsController.remove);
router.post("/:id/test", automationsController.testRun);

export default router;
