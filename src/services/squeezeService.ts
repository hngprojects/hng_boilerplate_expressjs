import { Squeeze } from "../models";
import AppDataSource from "../data-source";
import { Conflict, BadRequest } from "../middleware";
import { squeezeSchema } from "../schema/squeezeSchema";
import { Repository } from "typeorm";

class SqueezeService {
  private squeezeRepository: Repository<Squeeze>;

  constructor() {
    this.squeezeRepository = AppDataSource.getRepository(Squeeze);
  }

  public async createSqueeze(data: Partial<Squeeze>): Promise<Squeeze> {
    const validation = squeezeSchema.safeParse(data);
    if (!validation.success) {
      throw new Conflict(
        "Validation failed: " +
          validation.error.errors.map((e) => e.message).join(", "),
      );
    }

    try {
      const existingSqueeze = await this.squeezeRepository.findOne({
        where: { email: data.email },
      });

      if (existingSqueeze) {
        throw new Conflict(
          "A squeeze has already been generated using this email",
        );
      }

      const squeeze = this.squeezeRepository.create(data);
      const savedSqueeze = await this.squeezeRepository.save(squeeze);
      return savedSqueeze;
    } catch (error) {
      throw new BadRequest("Failed to create squeeze: " + error.message);
    }
  }

  public async getSqueezeById(id: string): Promise<Squeeze | null> {
    try {
      const squeeze = await this.squeezeRepository.findOne({ where: { id } });
      return squeeze;
    } catch (error) {
      throw new BadRequest("Failed to retrieve squeeze: " + error.message);
    }
  }
}

export { SqueezeService };
