import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Contact {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 100 })
  email!: string;

  @Column({ type: "varchar", length: 20 })
  phone_number!: string;

  @Column({ type: "text" })
  message!: string;
}
