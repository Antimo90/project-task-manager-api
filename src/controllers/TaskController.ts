import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Task } from "../entities/Task.js";

export class TaskController {
  //creazione delle task
  async create(req: Request, res: Response) {
    const { title } = req.body;
    if (!title || title.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Il titolo del task deve avere almeno 3 caratteri" });
    }
    try {
      const taskRepo = AppDataSource.getRepository(Task);
      const newTask = taskRepo.create(req.body);
      const saveTask = await taskRepo.save(newTask);
      return res.status(201).json(saveTask);
    } catch (error) {
      return res.status(500).json({ message: "Errore creazione task", error });
    }
  }

  //trova tutte le task
  async getAll(req: Request, res: Response) {
    try {
      const taskRepo = AppDataSource.getRepository(Task);
      const task = await taskRepo.find();
      console.log("Qualcuno ha bussato alla porta!", req.method);
      return res.status(200).json(task);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Errore nel recupero dati", error });
    }
  }

  //Recupero un singolo Task tramite ID, includendo i progetti associati.
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const taskRepo = AppDataSource.getRepository(Task);

      // Cerchiamo il task includendo la relazione con i progetti
      const task = await taskRepo.findOne({
        where: { id_task: Number(id) },
        relations: { projects: true },
      });

      if (!task) {
        return res.status(404).json({ message: "Task non trovato" });
      }

      return res.json(task);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Errore nel recupero del task", error });
    }
  }

  //modifica le task
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const taskRepo = AppDataSource.getRepository(Task);

      let task = await taskRepo.findOneBy({ id_task: Number(id) });

      if (!task) {
        return res.status(404).json({ message: "Task non trovato" });
      }

      // controllo che ci sia una vera modifica nei dati e che siano corretti
      // campi modificabili(accettati)
      const allowedKeys: (keyof Task)[] = ["title", "description", "tags"];

      // chiavi mandate dall'utente nel body
      const receivedKeys = Object.keys(req.body) as (keyof Task)[];

      // controllo che le chiavi siano prensenti
      const isEveryKeyValid = receivedKeys.every((key) =>
        allowedKeys.includes(key),
      );

      if (!isEveryKeyValid) {
        return res.status(400).json({
          message:
            "Errore: Stai provando ad aggiornare campi inesistenti o non permessi!",
        });
      }

      // controlle che ci siano davvero modifiche
      const hasChanges = receivedKeys.some((key) => {
        return task![key] !== req.body[key];
      });

      if (!hasChanges) {
        return res.status(400).json({
          message:
            "Attenzione: i dati inviati sono identici a quelli attuali. Nulla da modificare.",
        });
      }

      //uniamo i dati della modifica alla vecchia task
      taskRepo.merge(task, req.body);
      const updateTask = await taskRepo.save(task);

      return res
        .status(200)
        .json({ message: "Task aggiornato correttamente", updateTask });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Errore durante update della task", error });
    }
  }

  //funzione per eliminare una task
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const taskRepo = AppDataSource.getRepository(Task);

      const result = await taskRepo.delete(Number(id));

      if (result.affected === 0) {
        return res.status(404).json({ message: "Task non trovato" });
      }

      return res.status(200).json({ message: "Task eliminato con successo" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Errore durante L'eliminazione della task", error });
    }
  }

  // 1. Cerca per Tag
  async getByTag(req: Request, res: Response) {
    try {
      const { tagName } = req.params;
      const taskRepo = AppDataSource.getRepository(Task);

      const tasks = await taskRepo
        .createQueryBuilder("task")
        .where("task.tags LIKE :tag", { tag: `%${tagName}%` })
        .getMany();

      if (tasks.length === 0) {
        return res.status(404).json({
          message: `Nessun task trovato con il tag: "${tagName}"`,
        });
      }

      return res.json(tasks);
    } catch (error) {
      return res.status(500).json({ message: "Errore ricerca per tag", error });
    }
  }

  // 2. Cerca per ID Progetto
  async getByProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const taskRepo = AppDataSource.getRepository(Task);

      const tasks = await taskRepo
        .createQueryBuilder("task")
        .innerJoin("task.projects", "project")
        .where("project.id_project = :id", { id: Number(projectId) })
        .getMany();

      if (tasks.length === 0) {
        return res.status(404).json({
          message: `Nessun task trovato per il progetto con ID: ${projectId}`,
        });
      }

      return res.json(tasks);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Errore ricerca per progetto", error });
    }
  }
}
