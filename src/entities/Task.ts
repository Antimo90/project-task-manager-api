import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./Project.js";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id_task: number;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column("simple-json", { nullable: true })
  tags: string[];

  @ManyToMany(() => Project, (project) => project.tasks)
  projects: Project[];
}
