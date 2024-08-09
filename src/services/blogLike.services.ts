import AppDataSource from "../data-source";
import { Like } from "../models/like";
import { Blog } from "../models/blog";
import { User } from "../models/user";

const likeRepository = AppDataSource.getRepository(Like);
const blogRepository = AppDataSource.getRepository(Blog);
const userRepository = AppDataSource.getRepository(User);

export const addLike = async (blogId: string, userId: string) => {
  const blog = await blogRepository.findOneBy({ id: blogId });
  const user = await userRepository.findOneBy({ id: userId });

  if (!blog || !user) throw new Error("Blog or User not found");

  const newLike = new Like();
  newLike.blog = blog;
  newLike.user = user;

  return likeRepository.save(newLike);
};
