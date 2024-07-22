import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToMany,
  Unique,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Profile, Product, Organization, Sms, Blog } from ".";
import { IsEmail } from "class-validator";
import ExtendedBaseEntity from "./extended-base-entity";
import { getIsInvalidMessage } from "../utils";
import { UserRole } from "../enums/userRoles";

@Entity()
@Unique(["email"])
export class User extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  @IsEmail(undefined, { message: getIsInvalidMessage("Email") })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'int',
    default: 0,
  })
  attempts_left: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  time_left: Date | null;

  @Column({
    default: false,
  })
  isverified: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column()
  otp: number;

  @Column()
  otp_expires_at: Date;

  @OneToMany(() => Product, (product) => product.user, { cascade: true })
  @JoinTable()
  products: Product[];

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @OneToMany(() => Sms, (sms) => sms.sender)
  sms: Sms[];

  @ManyToMany(() => Organization, (organization) => organization.users, {
    cascade: true,
  })
  @JoinTable()
  organizations: Organization[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
