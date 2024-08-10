import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NewsLetterSubscriber {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  isSubscribe: boolean;
}
