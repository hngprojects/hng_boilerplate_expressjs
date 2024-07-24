import { getRepository, Repository } from 'typeorm';
import AppDataSource from '../data-source';
import { Blog } from '../models/blog';

export class BlogService {
  private blogRepository: Repository<Blog>;

  constructor() {
    this.blogRepository = AppDataSource.getRepository(Blog);
  }

  async getPaginatedBlogsByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ blogs: Blog[]; totalItems: number }> {
    const [blogs, totalItems] = await this.blogRepository.findAndCount({
      where: { author: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author'],
    });

    return { blogs, totalItems };
  }
}
