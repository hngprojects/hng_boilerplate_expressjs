import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";
import ExtendedBaseEntity from "./extended-base-entity";
import {
  IsString,
  IsNumber,
  IsPositive,
  MinLength,
  validateOrReject,
  IsNotEmpty,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: Name of the product
 *         description:
 *           type: string
 *           description: Description of the product
 *         price:
 *           type: number
 *           description: Price of the product
 *         category:
 *           type: string
 *           description: Category of the product
 */

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

  @ManyToOne(() => User, (user) => user.products)
  user: User;
}

export class ProductDTO {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name must not be empty" })
  @MinLength(1, { message: "Name must not be empty" })
  name: string;

  @IsString({ message: "Description must be a string" })
  @IsNotEmpty({ message: "Description must not be empty" })
  @MinLength(1, { message: "Description must not be empty" })
  description: string;

  @IsNumber({}, { message: "Price must be a number" })
  @IsPositive({ message: "Price must be positive" })
  price: number;

  @IsNumber({}, { message: "Price must be a number" })
  @IsPositive({ message: "Price must be positive" })
  quantity: number = 1;

  @IsString({ message: "Category must be a string" })
  @IsNotEmpty({ message: "Category must not be empty" })
  @MinLength(1, { message: "Category must not be empty" })
  category: string;

  async validate() {
    await validateOrReject(this, {
      validationError: { target: false, value: true },
      skipMissingProperties: false,
    });
  }

  constructor(data: Partial<ProductDTO>) {
    Object.assign(this, data);
  }
}
