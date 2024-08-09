import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import ExtendedBaseEntity from "./extended-base-entity";

@Entity()
export class Testimonial extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  client_name: string;

  @Column()
  client_position: string;

  @Column()
  testimonial: string;
}
