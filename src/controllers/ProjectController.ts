import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Project } from "../entities/Project.js";
import { Task } from "../entities/Task.js";

export class ProjectController {
  //funzione per creare un progetto
  async create(req: Request, res: Response) {
    const { name, budget } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        message: "Il nome è obbligatorio e deve avere almeno 3 caratteri",
      });
    }

    if (budget !== undefined && (typeof budget !== "number" || budget < 0)) {
      return res
        .status(400)
        .json({ message: "Il budget deve essere un numero positivo" });
    }
    try {
      const projectRepo = AppDataSource.getRepository(Project);
      const newProject = projectRepo.create(req.body);
      const saveProject = await projectRepo.save(newProject);
      return res.status(201).json(saveProject);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Errore durante la creazione ", error });
    }
  }

  //funzione per vedere tutti i progetti
  async getAll(req: Request, res: Response) {
    try {
      const projectRepo = AppDataSource.getRepository(Project);
      const projects = await projectRepo.find();
      console.log("Qualcuno ha bussato alla porta!", req.method);
      return res.status(200).json(projects);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Errore nel recupero dati", error });
    }
  }

  //funzione per aggiungere una task a un progetto
  async addTask(req: Request, res: Response) {
    try {
      const { projectId, taskId } = req.params;

      const projectRepo = AppDataSource.getRepository(Project);
      const taskRepo = AppDataSource.getRepository(Task);

      //cerca il progetto
      const project = await projectRepo.findOne({
        where: { id_project: Number(projectId) },
        relations: { tasks: true },
      });

      //cerca il task
      const task = await taskRepo.findOneBy({ id_task: Number(taskId) });

      if (!project || !task) {
        return res.status(404).json({ message: "Progetto o Task non trovato" });
      }

      //aggiunge la task alla lista delle task del progetto
      project.tasks.push(task);

      //salviamo il progetto aggiornato
      await projectRepo.save(project);
      return res
        .status(200)
        .json({ message: "Task aggiunto al progetto con successo", project });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Errore nel collegamento", error });
    }
  }

  //recupera un progetto con id e le sue task
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const projectRepo = AppDataSource.getRepository(Project);

      const project = await projectRepo.findOne({
        where: { id_project: Number(id) },
        relations: { tasks: true },
      });

      if (!project) {
        return res.status(404).json({ message: "Progetto non trovato" });
      }
      return res.status(200).json(project);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Errore nel recupero del progetto", error });
    }
  }

  //cancella progetto dal database
  async deleteProj(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const projectRepo = AppDataSource.getRepository(Project);

      const result = await projectRepo.delete(Number(id));

      if (result.affected === 0) {
        return res.status(404).json({ message: "Progetto non trovato" });
      }
      return res
        .status(200)
        .json({ message: "Progetto eliminato con successo" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Errore durante la cancellazione", error });
    }
  }

  //funzione per modificare un progetto
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const projectRepo = AppDataSource.getRepository(Project);

      let project = await projectRepo.findOneBy({ id_project: Number(id) });

      if (!project) {
        return res
          .status(404)
          .json({ message: "Progetto non trovato, impossibile modificare" });
      }

      // controllo che ci sia una vera modifica nei dati e che siano corretti
      // campi modificabili(accettati)
      const allowedKeys: (keyof Project)[] = [
        "name",
        "description",
        "budget",
        "hours_used",
      ];

      // chiavi mandate dall'utente nel body
      const receivedKeys = Object.keys(req.body) as (keyof Project)[];

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
        return project![key] !== req.body[key];
      });

      if (!hasChanges) {
        return res.status(400).json({
          message:
            "Attenzione: i dati inviati sono identici a quelli attuali. Nulla da modificare.",
        });
      }

      //fondiamo i dati vecchi con quelli nuovi
      projectRepo.merge(project, req.body);

      const result = await projectRepo.save(project);

      return res.status(200).json({ message: "Progetto aggiornato", result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Errore durante l'aggiornamento", error });
    }
  }
}
