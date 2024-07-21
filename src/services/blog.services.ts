import { User, BlogPost } from "../models";
import { IBlogService } from "../types";
import { AppDataSource } from '../data-source';

export class BlogService implements IBlogService {
    private blogPostRepository = AppDataSource.getRepository(BlogPost);
    
    async getPaginatedBlogPosts(page: number = 1, pageSize: number = 10): Promise<{ count: number, next: string | null, previous: string | null, results: BlogPost[] }> {
        const [results, count] = await this.blogPostRepository.findAndCount({
            relations: ['author'],
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { createdAt: "DESC" }
        });

        const next = page * pageSize < count ? `/api/v1/blogs?page=${page + 1}&page_size=${pageSize}` : null;
        const previous = page > 1 ? `/api/v1/blogs?page=${page - 1}&page_size=${pageSize}` : null;

        return { count, next, previous, results };
    }

}
