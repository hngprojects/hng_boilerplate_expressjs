import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import ExtendedBaseEntity from "./extended-base-entity";

@Entity()
export class JobListing extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    location: string

    @Column()
    salary: string

    @Column()
    job_type: string
}