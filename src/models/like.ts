import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Blog } from './blog';
import { User } from './user';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Blog, blog => blog.likes)
  blog: Blog;

  @ManyToOne(() => User, user => user.likes)
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
