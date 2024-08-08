import AppDataSource, { initializeDataSource } from "../data-source";
import { Comment } from "../models/comment";
import { Blog } from "../models/blog";
import log from "../utils/logger";
import { ResourceNotFound } from "../middleware";
import { User } from "../models";

let commentRepository;
let blogRepository;

async function initializeRepositories() {
  await initializeDataSource();
  commentRepository = AppDataSource.getRepository(Comment);
  blogRepository = AppDataSource.getRepository(Blog);
}

export const createComment = async (
  blogId: string,
  content: string,
  userId: string,
) => {
  await initializeRepositories();
  const blog = await blogRepository.findOneBy({ id: blogId });
  const user = await AppDataSource.getRepository(User).findOneBy({
    id: userId,
  });

  if (!blog) throw new Error("Blog not found");
  if (!user) throw new Error("User not found");

  const newComment = new Comment();
  newComment.content = content;
  newComment.blog = blog;
  newComment.author = user;

  return commentRepository.save(newComment);
};

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
  await initializeRepositories();
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

export const getAllComments = async (blogId: string) => {
  await initializeRepositories();
  const blog = await blogRepository.findOne({
    where: { id: blogId },
    relations: ["comments", "comments.author"],
  });

  if (!blog) {
    throw new ResourceNotFound("Blog post not found");
  }

  return blog.comments.map((comment) => ({
    id: comment.id,
    author: comment.author ? comment.author.name : "Anonymous",
    text: comment.content,
    timestamp: comment.created_at.toISOString(),
  }));
};
