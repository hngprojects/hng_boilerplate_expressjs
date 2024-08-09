import { Blog } from "../models/blog";
import AppDataSource from "../data-source";

export const updateBlogPost = async (
  id: string,
  title: string,
  content: string,
  published_at?: Date,
  image_url?: string,
) => {
  const blogRepository = AppDataSource.getRepository(Blog);

  let blog;
  try {
    blog = await blogRepository.findOne({ where: { id } });
  } catch (error) {
    throw new Error("Error finding blog post.");
  }

  if (!blog) {
    throw new Error("Blog post not found.");
  }

  blog.title = title;
  blog.content = content;

  if (published_at) {
    blog.published_at = published_at;
  }

  if (image_url) {
    blog.image_url = image_url;
  }

  try {
    await blogRepository.save(blog);
  } catch (error) {}

  return blog;
};
