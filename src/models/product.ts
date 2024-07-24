import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import ExtendedBaseEntity from './extended-base-entity';
import { IsString, IsNumber, IsOptional } from 'class-validator';

@Entity()
export class Product extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @Column()
  @IsString()
  category: string;

  @ManyToOne(() => User, (user) => user.products)
  user: User;
}

