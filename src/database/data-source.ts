import "reflect-metadata";
import { DataSource } from "typeorm";
import { Project } from "../entities/Project.js";
import { Task } from "../entities/Task.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "postgres",
  password: "password",
  database: "project_management",
  synchronize: true,
  logging: true,
  entities: [Project, Task],
  subscribers: [],
  migrations: [],
});
