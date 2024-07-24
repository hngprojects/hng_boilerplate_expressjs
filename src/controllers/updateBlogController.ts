import { Request, Response } from "express";
import { updateBlogPost } from "../services/updateBlog.services";

export const updateBlogController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, published_at, image_url } = req.body;

  console.log("Controller - updateBlogController called with id:", id);
  console.log("Controller - Request body:", req.body);

  try {
    const updatedBlog = await updateBlogPost(
      id,
      title,
      content,
      published_at,
      image_url,
    );
    console.log("Controller - Blog post updated successfully:", updatedBlog);

    return res.status(200).json({
      status: "success",
      status_code: 200,
      message: "Blog post updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Controller - Error updating blog post:", error);

    return res.status(500).json({
      status: "unsuccessful",
      status_code: 500,
      message: "Failed to update the blog post. Please try again later.",
    });
  }
};
