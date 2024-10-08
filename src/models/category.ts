import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Blog } from "./blog";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Blog, (blog) => blog.categories)
  blogs: Blog[];
}
