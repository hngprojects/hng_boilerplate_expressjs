import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Log {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  action: string;

  @Column()
  details: string;

  @Column()
  timestamp: Date;
}
