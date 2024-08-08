import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity()
  class Squeeze {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ nullable: true })
    first_name?: string;
  
    @Column({ nullable: true })
    last_name?: string;
  
    @Column({ nullable: true })
    phone?: string;
  
    @Column({ nullable: true })
    location?: string;
  
    @Column({ nullable: true })
    job_title?: string;
  
    @Column({ nullable: true })
    company?: string;
  
    @Column("simple-array", { nullable: true })
    interests?: string[];
  
    @Column({ nullable: true })
    referral_source?: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  
  export { Squeeze };