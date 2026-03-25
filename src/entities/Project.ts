import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Task } from "./Task.js";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id_project: number;

  @Column()
  name: string;

  @Column("float")
  budget: number;

  @Column({ type: "text", nullable: false })
  description: string;

  @Column("int", { default: 0 })
  hours_used: number;

  @ManyToMany(() => Task, (task) => task.projects)
  @JoinTable()
  tasks: Task[];
}
