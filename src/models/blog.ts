import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";
import { Comment } from "./comment";
import { Like } from "./like";
import { Tag } from "./tag";
import { User } from "./user";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  image_url: string;

  @ManyToOne(() => User, (user) => user.blogs)
  author: User;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Comment[];

  @ManyToMany(() => Tag, (tag) => tag.blogs)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => Category, (category) => category.blogs)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Like, (like) => like.blog)
  likes: Like[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  published_at: Date;
}
