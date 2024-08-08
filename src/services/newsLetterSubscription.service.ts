import { Repository } from "typeorm";
import { NewsLetterSubscriber } from "../models/newsLetterSubscription";
import { INewsLetterSubscriptionService } from "../types";
import AppDataSource from "../data-source";
import { HttpError, ResourceNotFound } from "../middleware";

export class NewsLetterSubscriptionService
  implements INewsLetterSubscriptionService
{
  private newsLetterSubscriber: Repository<NewsLetterSubscriber>;

  constructor() {
    this.newsLetterSubscriber =
      AppDataSource.getRepository(NewsLetterSubscriber);
  }

  public async subscribeUser(email: string): Promise<{
    isSubscribe: boolean;
    subscriber: NewsLetterSubscriber;
  }> {
    let isSubscribe = false;
    const isExistingSubscriber = await this.newsLetterSubscriber.findOne({
      where: { email },
    });
    if (isExistingSubscriber) {
      isSubscribe = true;
      return { isSubscribe, subscriber: isExistingSubscriber };
    }
    const newSubscriber = new NewsLetterSubscriber();
    newSubscriber.email = email;
    const subscriber = await this.newsLetterSubscriber.save(newSubscriber);
    if (!subscriber) {
      throw new HttpError(
        500,
        "An error occurred while processing your request",
      );
    }
    return { isSubscribe, subscriber };
  }

  public async restoreSubscription(subscriptionId: string): Promise<NewsLetterSubscriber | null> {
    const subscription = await this.newsLetterSubscriber.findOne({
      where: { id: subscriptionId },
    });
  
    if (!subscription || subscription.isActive) {
      throw new ResourceNotFound("Subscription not found");
    }
  
    subscription.isActive = true;
    await this.newsLetterSubscriber.save(subscription);
  
    return subscription;
  }
}
