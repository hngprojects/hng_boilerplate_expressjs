// src/models/Product.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';
import ExtendedBaseEntity from "./extended-base-entity";
import { Category } from './Category';
import { User } from './User';

@Entity('products')
export class Product extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  slug: string;

  @ManyToMany(() => Category, category => category.products)
  categories: Category[];

  @ManyToOne(() => User, (user) => user.products)
  user: User;
}
