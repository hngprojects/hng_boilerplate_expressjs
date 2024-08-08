import { Repository } from "typeorm";
import { Product } from "../models/product";
import AppDataSource from "../data-source";
import { ProductSize, StockStatus } from "../enums/product";
import { ProductSchema } from "../schema/product.schema";
import { InvalidInput, ResourceNotFound, ServerError } from "../middleware";
import { Organization } from "../models/organization";
import { UserRole } from "../enums/userRoles";

export class ProductService {
  private productRepository: Repository<Product>;
  private organizationRepository: Repository<Organization>;

  private entities: {
    [key: string]: {
      repo: Repository<any>;
      name: string;
    };
  };

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
    this.organizationRepository = AppDataSource.getRepository(Organization);

    this.entities = {
      product: {
        repo: this.productRepository,
        name: "Product",
      },
      organization: {
        repo: this.organizationRepository,
        name: "Organization",
      },
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

  private async calculateProductStatus(quantity: number): Promise<StockStatus> {
    if (quantity === 0) {
      return StockStatus.OUT_STOCK;
    }
    return quantity >= 5 ? StockStatus.IN_STOCK : StockStatus.LOW_STOCK;
  }

  public async createProduct(orgId: string, new_Product: ProductSchema) {
    const { organization } = await this.checkEntities({ organization: orgId });
    if (!organization) {
      throw new ServerError("Invalid organisation credentials");
    }

    const newProduct = this.productRepository.create(new_Product);
    newProduct.org = organization;
    newProduct.stock_status = await this.calculateProductStatus(
      new_Product.quantity ?? 0,
    );

    const product = await this.productRepository.save(newProduct);
    if (!product) {
      throw new ServerError(
        "An unexpected error occurred. Please try again later.",
      );
    }

    return {
      status_code: 201,
      status: "success",
      message: "Product created successfully",
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        status: product.stock_status,
        quantity: product.quantity,
        created_at: product.created_at,
        updated_at: product.updated_at,
      },
    };
  }
  public async deleteProduct(org_id: string, product_id: string) {
    try {
      const entities = await this.checkEntities({
        organization: org_id,
        product: product_id,
      });

      if (!entities.product) {
        throw new Error("Product not found");
      }

      await this.productRepository.remove(entities.product);
      return { message: "Product deleted successfully" };
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }
}
