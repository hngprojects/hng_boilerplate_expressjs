import { Entity, Column } from "typeorm";
import ExtendedBaseEntity from "./base-entity";

@Entity({ name: "testimonial" })
export class TestimonialEntity extends ExtendedBaseEntity {
  @Column({ nullable: false })
  client_name: string;

  @Column({ nullable: false })
  client_position: string;

  @Column({ nullable: false })
  testimonial: string;
}
