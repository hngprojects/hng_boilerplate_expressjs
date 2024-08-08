import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { NewsLetterSubscriber } from "../models/newsLetterSubscription";
import { INewsLetterSubscriptionService } from "../types";
import { BadRequest, HttpError, ResourceNotFound } from "../middleware";

export class NewsLetterSubscriptionService
  implements INewsLetterSubscriptionService
{
  private newsLetterSubscriber: Repository<NewsLetterSubscriber>;

  constructor() {
    this.newsLetterSubscriber =
      AppDataSource.getRepository(NewsLetterSubscriber);
  }

  public async subscribeUser(email: string): Promise<{
    isNewlySubscribe: boolean;
    subscriber: NewsLetterSubscriber;
  }> {
    let isNewlySubscribe = true;

    const isExistingSubscriber = await this.newsLetterSubscriber.findOne({
      where: { email },
    });
    if (isExistingSubscriber && isExistingSubscriber.isSubscribe === true) {
      isNewlySubscribe = false;
      return { isNewlySubscribe, subscriber: isExistingSubscriber };
    }

    if (isExistingSubscriber && isExistingSubscriber.isSubscribe === false) {
      throw new BadRequest(
        "You are already subscribed, please enable newsletter subscription to receive newsletter again",
      );
    }

    const newSubscriber = new NewsLetterSubscriber();
    newSubscriber.email = email;
    newSubscriber.isSubscribe = true;

    const subscriber = await this.newsLetterSubscriber.save(newSubscriber);

    if (!subscriber) {
      throw new HttpError(
        500,
        "An error occurred while processing your request",
      );
    }
    return { isNewlySubscribe, subscriber };
  }

  public async unSubcribeUser(email: string): Promise<any> {
    const isExistingSubscriber = await this.newsLetterSubscriber.findOne({
      where: { email },
    });

    if (!isExistingSubscriber) {
      throw new ResourceNotFound("You are not subscribed to newsletter");
    }

    if (isExistingSubscriber && isExistingSubscriber.isSubscribe === true) {
      isExistingSubscriber.isSubscribe = false;
      await this.newsLetterSubscriber.save(isExistingSubscriber);
      return isExistingSubscriber;
    }

    throw new BadRequest("You already unsubscribed to newsletter");
  }

  public async fetchAllNewsletter({
    page = 1,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }) {
    try {
      const [newsletters, total] = await this.newsLetterSubscriber.findAndCount(
        {
          skip: (page - 1) * limit,
          take: limit,
        },
      );
      const totalPages = Math.ceil(total / limit);
      const meta = {
        total,
        page,
        limit,
        totalPages,
      };

      return {
        data: newsletters,
        meta,
      };
    } catch (error) {
      throw error;
    }
  }
}
