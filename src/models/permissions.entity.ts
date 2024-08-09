import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PermissionCategory } from "../enums/permission-category.enum";
import ExtendedBaseEntity from "./extended-base-entity";
import { OrganizationRole } from "./organization-role.entity";

@Entity()
export class Permissions extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({
    type: "enum",
    enum: PermissionCategory,
  })
  category: PermissionCategory;

  @Column({ type: "boolean", nullable: false })
  permission_list: boolean;

  @ManyToOne(() => OrganizationRole, (role) => role.permissions, {
    eager: false,
  })
  role: OrganizationRole;
}
