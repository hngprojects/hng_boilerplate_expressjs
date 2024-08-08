import { Repository } from "typeorm";
import { NewsLetterSubscriber } from "../models/newsLetterSubscription";
import { INewsLetterSubscriptionService } from "../types";
import AppDataSource from "../data-source";
import { BadRequest, HttpError } from "../middleware";

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
}
