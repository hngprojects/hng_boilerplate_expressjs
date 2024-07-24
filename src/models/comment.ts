import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Blog } from "./blog";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;

  @CreateDateColumn()
  created_at: Date;
}
