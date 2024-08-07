import { Repository } from "typeorm";
import { Product, StockStatusType } from "../models/product";
import AppDataSource from "../data-source";
import { ProductSchema } from "../schemas/product";
import { InvalidInput, ResourceNotFound, ServerError } from "../middleware";
import { Organization } from "../models/organization";

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

  private async calculateProductStatus(
    quantity: number,
  ): Promise<StockStatusType> {
    if (quantity === 0) {
      return StockStatusType.OUT_STOCK;
    }
    return quantity >= 5 ? StockStatusType.IN_STOCK : StockStatusType.LOW_STOCK;
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
        status: product.stock_status,
        is_deleted: product.is_deleted,
        quantity: product.quantity,
        created_at: product.created_at,
        updated_at: product.updated_at,
      },
    };
  }

  public async getProducts(
    orgId: string,
    query: {
      name?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
    },
    page: number = 1,
    limit: number = 10,
  ) {
    const org = await this.organizationRepository.findOne({
      where: { id: orgId },
    });
    if (!org) {
      throw new ServerError(
        "Unprocessable entity exception: Invalid organization credentials",
      );
    }

    const { name, category, minPrice, maxPrice } = query;
    const queryBuilder = this.productRepository
      .createQueryBuilder("product")
      .where("product.orgId = :orgId", { orgId });

    if (name) {
      queryBuilder.andWhere("product.name ILIKE :name", { name: `%${name}%` });
    }
    if (minPrice !== undefined) {
      queryBuilder.andWhere("product.price >= :minPrice", { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere("product.price <= :maxPrice", { maxPrice });
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    console.log("Query results:", products);

    if (products.length === 0) {
      throw new ResourceNotFound("No products found");
    }

    return {
      success: true,
      statusCode: 200,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }
}
