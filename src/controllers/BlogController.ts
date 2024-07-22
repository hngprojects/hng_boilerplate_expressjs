import { Request, Response, NextFunction } from "express";
import { BlogService } from "../services/blog.services";

const blogService = new BlogService();

const getPaginatedBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.page_size as string) || 10;

        if (page <= 0 || pageSize <= 0) {
            return res.status(400).json({ error: "Invalid page or page_size parameter" });
        }

        const { count, next, previous, results } = await blogService.getPaginatedBlogPosts(page, pageSize);

        const summaries = results.map(blog => ({
            id: blog.id,
            title: blog.title,
            excerpt: blog.content.substring(0, 100), // Example: first 100 characters as excerpt
            image_url: blog.imageUrl,
            tags: blog.tags,
            created_at: blog.createdAt,
        }));

        res.status(200).json({ count, next, previous, results: summaries });
    } catch (error) {
        next(error);
    }
};



export { getPaginatedBlogs };
