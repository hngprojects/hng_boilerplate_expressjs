import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import ExtendedBaseEntity from "./extended-base-entity";
import { UserRole } from "../enums/userRoles";

@Entity()
class FAQ extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  question: string;

  @Column({ nullable: false })
  answer: string;

  @Column({ nullable: false })
  category: string;

  @Column({ nullable: false, default: UserRole.SUPER_ADMIN })
  createdBy: string;
}

export { FAQ };
