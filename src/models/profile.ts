import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { User } from "./user";
import ExtendedBaseEntity from "./extended-base-entity";
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from "class-validator";
import { getIsInvalidMessage } from "../utils";

@ValidatorConstraint({ name: "IsValidMobilePhone", async: false })
// class IsValidMobilePhone implements ValidatorConstraintInterface {
//   validate(phone: string, args: ValidationArguments) {
//     return /^(?:\+\d{1,3}[- ]?)?\d{10}$/.test(phone);
//   }

//   defaultMessage(args: ValidationArguments) {
//     return getIsInvalidMessage("Phone number");
//   }
// }

@Entity()
export class Profile extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone: string;

  @Column()
  avatarUrl: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
