import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Blog } from "./blog";
import { User } from "./user";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  @JoinColumn({ name: "blog_id" })
  blog: Blog;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  @JoinColumn({ name: "user_id" })
  author: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
