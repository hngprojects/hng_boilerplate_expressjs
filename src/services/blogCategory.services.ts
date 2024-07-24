import AppDataSource from "../data-source";
import { Category } from "../models/category";

const categoryRepository = AppDataSource.getRepository(Category);

export const createCategory = async (name: string) => {
  const newCategory = new Category();
  newCategory.name = name;

  return categoryRepository.save(newCategory);
};
