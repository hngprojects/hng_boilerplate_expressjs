import {
  Column,
  Entity,
  ManyToOne,
  // JoinColumn,
  // DeleteDateColumn,
  // OneToMany,
  // OneToOne,
} from "typeorm";
import ExtendedBaseEntity from "./base-entity";

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

  // @ManyToOne(() => Organisation, org => org.products)
  // org: Organisation;
}
