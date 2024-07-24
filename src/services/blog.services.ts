import { getRepository, Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Blog } from "../models/blog";

export class BlogService {
  private blogRepository: Repository<Blog>;

  constructor() {
    this.blogRepository = AppDataSource.getRepository(Blog);
  }

  async getPaginatedblogs(
    page: number,
    limit: number,
  ): Promise<{ blogs: Blog[]; totalItems: number }> {
    const [blogs, totalItems] = await this.blogRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { blogs, totalItems };
  }
}
