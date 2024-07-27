import AppDataSource from "../data-source";
import { Comment } from "../models/comment";
import { Blog } from "../models/blog";

const commentRepository = AppDataSource.getRepository(Comment);
const blogRepository = AppDataSource.getRepository(Blog);

export const createComment = async (blogId: string, content: string) => {
  const blog = await blogRepository.findOneBy({ blog_id: blogId });

  if (!blog) throw new Error("Blog not found");

  const newComment = new Comment();
  newComment.content = content;
  newComment.blog = blog;

  return commentRepository.save(newComment);
};
