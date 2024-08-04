import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class EmailQueue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  templateId: string;

  @Column()
  recipient: string;

  @Column("json")
  variables: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
