import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController.js";

const router = Router();
const projectController = new ProjectController();

router.post("/projects", projectController.create);

router.get("/projects", projectController.getAll);

router.post("/projects/:projectId/tasks/:taskId", projectController.addTask);

router.get("/projects/:id", projectController.getOne);

router.delete("/projects/:id", projectController.deleteProj);

router.put("/projects/:id", projectController.update);

export default router;
