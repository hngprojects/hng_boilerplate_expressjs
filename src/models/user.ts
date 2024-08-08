import { IsEmail } from "class-validator";
import crypto from "crypto";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Blog, Organization, Product, Profile, Sms } from ".";
import { UserRole } from "../enums/userRoles";
import { getIsInvalidMessage } from "../utils";
import ExtendedBaseEntity from "./extended-base-entity";
import { Like } from "./like";
import { OrganizationMember } from "./organization-member";
import { UserOrganization } from "./user-organisation";

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

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  google_id: string;

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

  @Column({ nullable: true })
  otp: number;

  @Column({ nullable: true })
  otp_expires_at: Date;

  @OneToMany(() => Product, (product) => product.user, { cascade: true })
  @JoinTable()
  products: Product[];

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(
    () => UserOrganization,
    (userOrganization) => userOrganization.user,
  )
  userOrganizations: UserOrganization[];

  @OneToMany(() => Sms, (sms) => sms.sender, { cascade: true })
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

  @Column({ type: "boolean", default: false })
  is_deleted: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true, type: "bigint" })
  passwordResetExpires: number;

  @Column("jsonb", { nullable: true })
  timezone: {
    timezone: string;
    gmtOffset: string;
    description: string;
  };

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.organization_id,
  )
  organizationMembers: OrganizationMember[];

  createPasswordResetToken(): string {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  }
}
