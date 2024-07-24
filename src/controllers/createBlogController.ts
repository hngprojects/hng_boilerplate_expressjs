import { Request, Response } from "express";
import { createBlogPost } from "../services/createBlog.services";

export const createBlogController = async (req: Request, res: Response) => {
  const { title, content, image_url, tags, categories } = req.body;

  try {
    const newBlog = await createBlogPost(
      title,
      content,
      image_url,
      tags,
      categories
    );
    res.status(201).json({
      status: "success",
      status_code: 201,
      message: "Blog post created successfully",
      data: {
        blog: newBlog,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "unsuccessful",
      status_code: 500,
      message: error.message,
    });
  }
};
