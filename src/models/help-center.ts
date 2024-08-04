import { Entity, Column } from "typeorm";
import ExtendedBaseEntity from "./base-entity";

@Entity({ name: "help-center-topics" })
export class HelpCenterEntity extends ExtendedBaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @Column({ default: "ADMIN", nullable: false })
  author: string;
}
