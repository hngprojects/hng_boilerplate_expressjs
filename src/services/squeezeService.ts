import { Squeeze } from "../models";
import AppDataSource from "../data-source";
import { Conflict, ResourceNotFound } from "../middleware";
import { squeezeSchema } from "../schema/squeezeSchema";

const squeezeRepository = AppDataSource.getRepository(Squeeze);

class SqueezeService {
    public async createSqueeze(data: Partial<Squeeze>): Promise<Squeeze> {
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
}

export { SqueezeService };