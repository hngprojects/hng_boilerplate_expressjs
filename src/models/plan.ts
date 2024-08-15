import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import ExtendedBaseEntity from "../models/extended-base-entity";

@Entity("plans")
export class Plan extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column("decimal")
  price: number;

  @Column("simple-array")
  features: string[];

  @Column("text")
  limitations: string;
}
