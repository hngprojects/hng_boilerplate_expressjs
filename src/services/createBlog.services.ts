import AppDataSource from "../data-source";
import { Blog } from "../models/blog";
import { Tag } from "../models/tag";
import { Category } from "../models/category";
import { User } from "../models/user";

const blogRepository = AppDataSource.getRepository(Blog);
const tagRepository = AppDataSource.getRepository(Tag);
const categoryRepository = AppDataSource.getRepository(Category);
const userRepository = AppDataSource.getRepository(User);

export const createBlogPost = async (
  title: string,
  content: string,
  author_id: string,
  image_url?: string,
  tags?: string[],
  categories?: string[]
) => {

  // Find or create the author
  const author = await userRepository.findOne({ where: { id: author_id } });
  if (!author) {
    throw new Error("Author not found");
  }

   // Ensure tags is an array
   if (!Array.isArray(tags)) {
    throw new TypeError("tags must be an array");
  }

  // Ensure categories is an array
  if (!Array.isArray(categories)) {
    throw new TypeError("categories must be an array");
  }

  // Find or create the tags
  const tagInstances = await Promise.all(
    tags.map(async (tagName) => {
      let tag = await tagRepository.findOne({ where: { name: tagName } });
      if (!tag) {
        tag = new Tag();
        tag.name = tagName;
        await tagRepository.save(tag);
      }
      return tag;
    })
  );

  // Find or create the categories
  const categoriesinstances = await Promise.all(
    categories.map(async (categoryName) => {
      let category = await categoryRepository.findOne({
        where: { name: categoryName },
      });
      if (!category) {
        category = new Category();
        category.name = categoryName;
        await categoryRepository.save(category);
      }
      return category;
    })
  );

  // Create the blog
  const newBlog = new Blog();
  newBlog.title = title;
  newBlog.content = content;
  newBlog.image_url = image_url;
  newBlog.author = author;
  newBlog.tags = tagInstances;
  newBlog.categories = categoriesinstances;
  newBlog.published_at = new Date(); // Assuming you want to set the current date as published_at

  console.log(newBlog); // Log the blog instance to verify fields
  await blogRepository.save(newBlog);
  console.log("Blog saved successfully");

  return newBlog;
};
