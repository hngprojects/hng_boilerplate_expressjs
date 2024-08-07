import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Organization } from "./organization";
import ExtendedBaseEntity from "../models/base-entity";

export enum StockStatusType {
  IN_STOCK = "in stock",
  OUT_STOCK = "out of stock",
  LOW_STOCK = "low on stock",
}

export enum ProductSizeType {
  SMALL = "Small",
  STANDARD = "Standard",
  LARGE = "Large",
}

@Entity()
export class Product extends ExtendedBaseEntity {
  @Column({ type: "text", nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  category: string;

  @Column({ type: "text", nullable: true })
  image: string;

  @Column({ type: "int", nullable: false, default: 0 })
  price: number;

  @Column({ type: "int", nullable: false, default: 0 })
  quantity: number;

  @Column({ nullable: true, default: false })
  is_deleted: boolean;

  @Column({
    type: "enum",
    enum: ProductSizeType,
    default: ProductSizeType.STANDARD,
  })
  size: ProductSizeType;

  @Column({
    type: "enum",
    enum: StockStatusType,
    default: StockStatusType.OUT_STOCK,
  })
  stock_status: StockStatusType;

  // To be implemented when organization is created.
  @ManyToOne(() => Organization, (org) => org.products)
  org: Organization;
}
