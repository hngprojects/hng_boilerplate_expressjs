import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import { Organization } from "./Organization.model";
import { UUID } from "crypto";

@Entity()
export class Preference {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne(() => Organization, (organization) => organization.preferences)
  organization: Organization;
}
