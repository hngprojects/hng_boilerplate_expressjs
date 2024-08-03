import { Squeeze } from "../models";
import AppDataSource from "../data-source";
import { Conflict, ResourceNotFound } from "../middleware";
import { squeezeSchema } from "../schemas/squeeze";

const squeezeRepository = AppDataSource.getRepository(Squeeze);

class SqueezeService {
  static async createSqueeze(data: Partial<Squeeze>): Promise<Squeeze> {
    const validation = squeezeSchema.safeParse(data);
    if (!validation.success) {
      throw new Conflict(
        "Validation failed: " +
          validation.error.errors.map((e) => e.message).join(", "),
      );
    }

    const existingSqueeze = await squeezeRepository.findOne({
      where: { email: data.email },
    });

    if (existingSqueeze) {
      throw new Conflict(
        "A squeeze has already been generated using this email",
      );
    }
    const squeeze = squeezeRepository.create(data);
    const savedSqueeze = await squeezeRepository.save(squeeze);
    return savedSqueeze;
  }

  static async updateSqueeze(email: string, data: any): Promise<Squeeze> {
    const validation = squeezeSchema.safeParse(data);
    if (!validation.success) {
      throw new Conflict(
        "Validation failed: " +
          validation.error.errors.map((e) => e.message).join(", "),
      );
    }
    const squeeze = await squeezeRepository.findOne({
      where: { email },
    });

    if (!squeeze) {
      throw new ResourceNotFound(
        "No squeeze page record exists for the provided email",
      );
    }
    if (squeeze.updatedAt > squeeze.createdAt) {
      throw new Conflict("The squeeze page record can only be updated once");
    }
    Object.assign(squeeze, data);
    const updatedSqueeze = await squeezeRepository.save(squeeze);
    return updatedSqueeze;
  }
}

export { SqueezeService };
