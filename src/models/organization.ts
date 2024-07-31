import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { User } from "./user";
import { v4 as uuidv4 } from "uuid";
import { UserOrganization } from "./user-organisation";
import ExtendedBaseEntity from "./extended-base-entity";
import { Payment } from "./payment";

@Entity()
export class Organization extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column({ unique: true })
  @IsUUID()
  slug: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsOptional()
  industry: string;

  @Column({ nullable: true })
  @IsOptional()
  type: string;

  @Column({ nullable: true })
  @IsOptional()
  country: string;

  @Column({ nullable: true })
  @IsOptional()
  address: string;

  @Column({ nullable: true })
  @IsOptional()
  state: string;

  @Column("text", { nullable: true })
  @IsOptional()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column("uuid")
  @IsUUID()
  owner_id: string;

  @OneToMany(
    () => UserOrganization,
    (userOrganization) => userOrganization.organization,
  )
  userOrganizations: UserOrganization[];

  @ManyToMany(() => User, (user) => user.organizations)
  users: User[];

  @OneToMany(() => Payment, (payment) => payment.organization)
  payments: Payment[];

  @BeforeInsert()
  generateSlug() {
    this.slug = uuidv4();
  }
}
