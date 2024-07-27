// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   ManyToOne,
//   UpdateDateColumn,
// } from "typeorm";
// import ExtendedBaseEntity from "./extended-base-entity";
// import { User } from "./user";

// @Entity()
// export class Blog extends ExtendedBaseEntity {
//   @PrimaryGeneratedColumn("uuid")
//   id: string;

//   @Column()
//   title: string;

//   @Column()
//   content: string;

//   @ManyToOne(() => User, (user) => user.blogs)
//   author: User;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";
import { Tag } from "./tag";
import { Category } from "./category";
import { Like } from "./like";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn("uuid")
  blog_id: string;

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
