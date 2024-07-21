import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User, Organization } from ".";

@Entity()
class OrganisationInvitation {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column()
    invitation_link: string;
  
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
  
    @Column({ type: "timestamp", nullable: true })
    expire_at: Date;
  
    @Column({ type: "timestamp", nullable: true })
    deactivated_at: Date;
  
    @Column({ type: "boolean", default: true })
    is_active: boolean;
  
    @Column()
    org_id: string;
  
    @Column()
    user_id: string;
  
    @ManyToOne(() => Organization, (organization) => organization.invitations)
    @JoinColumn({ name: "org_id" })
    organization: Organization;
  
    @ManyToOne(() => User, (user) => user.invitations)
    @JoinColumn({ name: "user_id" })
    user: User;
}

export { OrganisationInvitation };
  