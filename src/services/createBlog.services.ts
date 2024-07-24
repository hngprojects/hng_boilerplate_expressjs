import AppDataSource from "../data-source";
import { Blog } from "../models/blog";
import { Tag } from "../models/tag";
import { Category } from "../models/category";

const blogRepository = AppDataSource.getRepository(Blog);
const tagRepository = AppDataSource.getRepository(Tag);
const categoryRepository = AppDataSource.getRepository(Category);

export const createBlogPost = async (
  title: string,
  content: string,
  image_url?: string,
  tags?: number[],
  categories?: number[]
) => {
  const newBlog = new Blog();
  newBlog.title = title;
  newBlog.content = content;
  newBlog.image_url = image_url;

  if (tags) {
    const tagInstances = await tagRepository.findByIds(tags);
    newBlog.tags = tagInstances;
  }

  if (categories) {
    const categoryInstances = await categoryRepository.findByIds(categories);
    newBlog.categories = categoryInstances;
  }

  return blogRepository.save(newBlog);
};
