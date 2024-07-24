import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Blog } from './blog';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Blog, blog => blog.tags)
  blogs: Blog[];
}
