import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import ExtendedBaseEntity from './extended-base-entity';


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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  category: string;

  @ManyToOne(() => User, (user) => user.products)
  user: User;
}
