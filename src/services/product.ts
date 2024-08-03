import { Repository } from "typeorm";
import { Product } from "../models";
import AppDataSource from "../data-source";
import { ProductSchema } from "../schemas/product";
import { InvalidInput, ResourceNotFound } from "../middleware";

export class ProductService {
  private productRepository: Repository<Product>;
  // private organisationRepository: Repository<organisation>

  private entities: {
    [key: string]: {
      repo: Repository<any>;
      name: string;
    };
  };

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
    // this.organisationRepository = AppDataSource.getRepository(Organisation)

    this.entities = {
      product: {
        repo: this.productRepository,
        name: "Product",
      },
      // organisation: {
      //   repo: this.organisationRepository,
      //   name: 'Organisation'
      // }
    };
  }

  private async checkEntities(
    entitiesToCheck: {
      [key: string]: string;
    } = { product: "" },
  ): Promise<{ [key: string]: any }> {
    const foundEntities: { [key: string]: any } = {};

    for (const [entityKey, id] of Object.entries(entitiesToCheck)) {
      const entity = this.entities[entityKey];
      if (!entity) {
        throw new InvalidInput(`Invalid entity type: ${entityKey}`);
      }

      if (!id) {
        throw new InvalidInput(`${entity.name} ID not provided`);
      }

      const found = await entity.repo.findOne({ where: { id } });
      if (!found) {
        throw new ResourceNotFound(`${entity.name} with id ${id} not found`);
      }

      foundEntities[entityKey] = found;
    }

    return foundEntities;
  }

  public async updateProduct(
    org_id: string,
    product_id: string,
    updateDetails: ProductSchema,
  ) {
    const entities = await this.checkEntities({
      organisation: org_id,
      product: product_id,
    });

    return entities.product.update(updateDetails);
  }

  public async deleteProduct(org_id: string, product_id: string) {
    const entities = await this.checkEntities({
      organisation: org_id,
      product: product_id,
    });

    return this.productRepository.remove(entities.product);
  }

  public async getProduct(product_id: string) {
    const { product } = await this.checkEntities({ product: product_id });
    return product;
  }
}
