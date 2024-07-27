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

/**
 * This function checks if 30 mins has elapsed since the comment was created or updated
 * @param createdAt
 * @param updatedAt
 * @returns boolean
 */
function hasThirtyMinutesElapsed(
  createdAt: Date,
  updatedAt: Date | null,
): boolean {
  const currentTime = new Date();

  // Create Date objects for createdAt and updatedAt
  const createdAtDate = new Date(createdAt);
  const updatedAtDate = updatedAt ? new Date(updatedAt) : null;

  // Calculate the time 30 minutes after createdAt and updatedAt
  const createdAtPlus30Min = new Date(createdAtDate.getTime() + 30 * 60 * 1000);
  const updatedAtPlus30Min = updatedAtDate
    ? new Date(updatedAtDate.getTime() + 30 * 60 * 1000)
    : null;

  // Check if 30 minutes have elapsed since either createdAt or updatedAt
  if (updatedAtPlus30Min && currentTime < updatedAtPlus30Min) {
    return false;
  } else if (currentTime < createdAtPlus30Min) {
    return false;
  }

  // 30 minutes have elapsed since either createdAt or updatedAt
  return true;
}

export const editComment = async (commentId: number, content: string) => {
  //retrieve the comment
  const comment = await commentRepository.findOneBy({ id: commentId });

  //check if comment exists
  if (!comment) throw new Error("COMMENT_NOT_FOUND");

  //destructure the comment data
  const { created_at, updated_at } = comment;

  //check if created_at or updated_at is more than 30 mins
  const has30minsElapsed = hasThirtyMinutesElapsed(created_at, updated_at);

  //conditional check to determine if time for update is okay
  if (!has30minsElapsed) {
    throw new Error("TIME_NOT_OK");
  }

  //update the comment data
  const updateResult = await commentRepository.update(commentId, { content });

  return updateResult;
};
