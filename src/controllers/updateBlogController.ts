import { Request, Response } from "express";
import { updateBlogPost } from "../services/updateBlog.services";

export const updateBlogController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, published_at, image_url } = req.body;

  try {
    const updatedBlog = await updateBlogPost(
      id,
      title,
      content,
      published_at,
      image_url,
    );

    return res.status(200).json({
      status: "success",
      status_code: 200,
      message: "Blog post updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    return res.status(500).json({
      status: "unsuccessful",
      status_code: 500,
      message: "Failed to update the blog post. Please try again later.",
    });
  }
};
