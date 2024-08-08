import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class NewsLetterSubscriber {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;
  
  @Column()
  isSubscribe: boolean;
}
