import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductSize, StockStatus } from "../enums/product";
import ExtendedBaseEntity from "./extended-base-entity";
import { Organization } from "./organization";
import { User } from "./user";
@Entity()
export class Product extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ default: 1 })
  quantity: number;

  @Column()
  category: string;

  @Column()
  image: string;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: "enum",
    enum: ProductSize,
    default: ProductSize.STANDARD,
  })
  size: ProductSize;

  @Column({
    type: "enum",
    enum: StockStatus,
    default: StockStatus.OUT_STOCK,
  })
  stock_status: StockStatus;

  @ManyToOne(() => Organization, (org) => org.products)
  org: Organization;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @Column({ type: "float", nullable: false, default: 0 })
  cost_price: number;

  @DeleteDateColumn()
  deletedAt?: Date;
}
