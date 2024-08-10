import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { StockStatus } from "../enums/product";
import {
  HttpError,
  InvalidInput,
  ResourceNotFound,
  ServerError,
  Unauthorized,
} from "../middleware";
import { Organization } from "../models/organization";
import { Product } from "../models/product";
import { ProductSchema } from "../schema/product.schema";
import { User } from "../models";

export class ProductService {
  private productRepository: Repository<Product>;
  private organizationRepository: Repository<Organization>;
  private userRepository: Repository<User>;

  private entities: {
    [key: string]: {
      repo: Repository<any>;
      name: string;
    };
  };

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
    this.organizationRepository = AppDataSource.getRepository(Organization);
    this.userRepository = AppDataSource.getRepository(User);

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
    if (minPrice) {
      queryBuilder.andWhere("product.price >= :minPrice", { minPrice });
    }
    if (maxPrice) {
      queryBuilder.andWhere("product.price <= :maxPrice", { maxPrice });
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

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

  public async getProduct(org_id: string, product_id: string) {
    try {
      const entities = await this.checkEntities({
        organization: org_id,
        product: product_id,
      });

      if (!entities.product) {
        return new HttpError(404, "Product not found");
      }
      return entities.product;
    } catch (error) {
      throw new ResourceNotFound(error.message);
    }
  }

  public async updateProduct(
    orgId: string,
    productId: string,
    updatedProductData: Partial<ProductSchema>,
    userId: any,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ServerError("User not found");
    }
    if (user.role !== "admin") {
      throw new Unauthorized("Access denied. Admins only");
    }

    const organization = await this.organizationRepository.findOne({
      where: { id: orgId },
    });
    if (!organization) {
      throw new ServerError("Invalid organization credentials");
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new ResourceNotFound("Product not found");
    }
    const organisation = await this.organizationRepository.findOne({
      where: { id: orgId },
    });
    if (!organisation) {
      throw new ResourceNotFound("organisation not found");
    }

    if (updatedProductData.name !== undefined) {
      if (
        typeof updatedProductData.name !== "string" ||
        updatedProductData.name.trim() === ""
      ) {
        throw new InvalidInput("Invalid product name");
      }
      product.name = updatedProductData.name;
    }

    if (updatedProductData.quantity !== undefined) {
      if (
        typeof updatedProductData.quantity !== "number" ||
        updatedProductData.quantity < 0
      ) {
        throw new InvalidInput("Quantity must be a non-negative number");
      }
      product.quantity = updatedProductData.quantity;
      product.stock_status = await this.calculateProductStatus(
        updatedProductData.quantity,
      );
    }

    if (updatedProductData.price !== undefined) {
      if (
        typeof updatedProductData.price !== "number" ||
        updatedProductData.price <= 0
      ) {
        throw new InvalidInput("Price must be a positive number");
      }
      product.price = updatedProductData.price;
    }

    if (updatedProductData.category !== undefined) {
      if (
        typeof updatedProductData.category !== "string" ||
        updatedProductData.category.trim() === ""
      ) {
        throw new InvalidInput("Invalid category");
      }
      product.category = updatedProductData.category;
    }

    if (updatedProductData.image !== undefined) {
      if (
        typeof updatedProductData.image !== "string" ||
        updatedProductData.image.trim() === ""
      ) {
        throw new InvalidInput("Invalid image URL");
      }
      product.image = updatedProductData.image;
    }

    const updatedProduct = await this.productRepository.save(product);
    if (!updatedProduct) {
      throw new ServerError(
        "An unexpected error occurred. Please try again later.",
      );
    }

    return {
      status_code: 200,
      message: "Product updated successfully",
      data: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        category: updatedProduct.category,
        image: updatedProduct.image,
        quantity: updatedProduct.quantity,
        size: updatedProduct.size,
        stock_status: updatedProduct.stock_status,
        created_at: updatedProduct.created_at,
        updated_at: updatedProduct.updated_at,
      },
    };
  }
}
