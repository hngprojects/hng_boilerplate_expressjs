import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class EmailQueue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  templateId: number;

  @Column()
  recipient: string;

  @Column('json')
  variables: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

    // @Column({ default: false })
    // isActive: boolean;
}
