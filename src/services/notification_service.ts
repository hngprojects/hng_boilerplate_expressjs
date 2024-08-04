import { Repository } from "typeorm";
import {
  BadRequest,
  Conflict,
  HttpError,
  ResourceNotFound,
} from "../middleware";
import { User, NotificationSettings } from "../models";
import { INotificationService } from "../types";
import AppDataSource from "../data-source";
import log from "../utils/logger";

export class NotificationService implements INotificationService {
  private usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(User);
  }

  async getUserNotification(user_id: string): Promise<unknown> {
    const user = await this.usersRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new ResourceNotFound("User Not Found!");
    }

    return user;
  }
}
