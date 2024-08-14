import { Column, Entity } from "typeorm";
import ExtendedBaseEntity from "./base-entity";
import { IsEmail } from "class-validator";
import { getIsInvalidMessage } from "../utils";

@Entity()
export class Profile extends ExtendedBaseEntity {
  @Column()
  username: string;

  @Column({ unique: true, nullable: false })
  @IsEmail(undefined, { message: getIsInvalidMessage("Email") })
  email: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  pronouns: string;

  @Column({ nullable: true })
  department: string;

  @Column({ type: "text", nullable: true })
  bio: string;

  @Column({ type: "simple-array", nullable: true })
  social_links: string[];

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  timezones: string;

  @Column({ nullable: true })
  profile_pic_url: string;
}
