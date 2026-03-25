import { Router } from "express";
import { TaskController } from "../controllers/TaskController.js";

const router = Router();
const taskController = new TaskController();

router.post("/tasks", taskController.create);

router.get("/tasks", taskController.getAll);

router.get("/tasks/:id", taskController.getOne);

router.put("/tasks/:id", taskController.update);

router.delete("/tasks/:id", taskController.delete);

router.get("/tasks/tag/:tagName", taskController.getByTag);

router.get("/tasks/project/:projectId", taskController.getByProject);

export default router;
