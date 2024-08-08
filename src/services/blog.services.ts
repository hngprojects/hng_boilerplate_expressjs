import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Category, Tag, User } from "../models";
import { Blog } from "../models/blog";
import { ResourceNotFound } from "../middleware";

export class BlogService {
  private blogRepository: Repository<Blog>;
  private categoryRepository: Repository<Category>;
  private tagRepository: Repository<Tag>;
  private userRepository: Repository<User>;

  constructor() {
    this.blogRepository = AppDataSource.getRepository(Blog);
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.tagRepository = AppDataSource.getRepository(Tag);
    this.userRepository = AppDataSource.getRepository(User);
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

  async getPaginatedBlogsByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ blogs: Blog[]; totalItems: number }> {
    const [blogs, totalItems] = await this.blogRepository.findAndCount({
      where: { author: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
      relations: ["author"],
    });

    return { blogs, totalItems };
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    try {
      const result = await this.blogRepository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      throw new Error("Error deleting blog post");
    }
  }

  async createBlogPost(
    title: string,
    content: string,
    authorId: string,
    image_url?: string,
    tags?: string,
    categories?: string,
  ) {
    try {
      let tagEntities;
      let categoryEntities;
      const newBlog = new Blog();
      newBlog.title = title;
      newBlog.content = content;
      newBlog.image_url = image_url;
      newBlog.published_at = new Date();
      const author = await this.userRepository.findOne({
        where: { id: authorId },
      });
      newBlog.author = author;

      const tagsContent = tags.split(",");
      const categoriesContent = categories.split(",");

      if (tagsContent && tagsContent.length > 0) {
        tagEntities = await Promise.all(
          tagsContent.map(async (tagName: string) => {
            let tag = await this.tagRepository.findOne({
              where: { name: tagName },
            });
            if (!tag) {
              tag = this.tagRepository.create({ name: tagName });
              await this.tagRepository.save(tag);
            }
            return tag;
          }),
        );
      }

      if (categoriesContent && categoriesContent.length > 0) {
        categoryEntities = await Promise.all(
          categoriesContent.map(async (categoryName) => {
            let category = await this.categoryRepository.findOne({
              where: { name: categoryName },
            });
            if (!category) {
              category = this.categoryRepository.create({ name: categoryName });
              await this.categoryRepository.save(category);
            }

            return category;
          }),
        );
      }

      newBlog.tags = tagEntities;
      newBlog.categories = categoryEntities;
      return await this.blogRepository.save(newBlog);
    } catch (error) {
      throw error;
    }
  }
  async updateBlog(blogId: string, payload: Blog, userId: string) {
    const blog = await this.blogRepository.findOne({
      where: { id: blogId },
      relations: ["author"],
    });

    if (!blog) {
      throw new ResourceNotFound("Blog post not found");
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    Object.assign(blog, payload, { author: user });

    const updatedBlog = await this.blogRepository.save(blog);
    return {
      blog_id: updatedBlog.id,
      title: updatedBlog.title,
      content: updatedBlog.content,
      tags: updatedBlog.tags,
      image_urls: updatedBlog.image_url,
      author: updatedBlog.author.name,
      updatedBlog_at: updatedBlog.created_at,
    };
  }
}
