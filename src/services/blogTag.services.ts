import AppDataSource from "../data-source";
import { Tag } from "../models/tag";

const tagRepository = AppDataSource.getRepository(Tag);

export const createTag = async (name: string) => {
  const newTag = new Tag();
  newTag.name = name;

  return tagRepository.save(newTag);
};
