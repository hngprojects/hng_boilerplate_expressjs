import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { User } from "./user";
import ExtendedBaseEntity from "./extended-base-entity";

@Entity()
export class Organization extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  createdAt: Date;
  
  @Column()
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.organizations)
  users: User[];

  constructor(id?: string, name?: string, description?: string, createdAt?: Date, updatedAt?: Date) {
    super();
    if (id) this.id = id;
    if (name) this.name = name;
    if (description) this.description = description;
    if (createdAt) this.createdAt = createdAt;
    if (updatedAt) this.updatedAt = updatedAt;
  }
}
