import { Request, Response } from "express";
import { createBlogPost } from "../services/createBlog.services";

/**
 * @swagger
 * /api/v1/blog/create:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image_url:
 *                 type: string
 *               author_id:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - title
 *               - content
 *               - author_id
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blog:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         image_url:
 *           type: string
 *           nullable: true
 *         author:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *         categories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *         published_at:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       required:
 *         - title
 *         - content
 *         - author
 */

export const createBlogController = async (req: Request, res: Response) => {
  const { title, content, image_url, tags, categories, author_id } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      status: "error",
      status_code: 400,
      message: "Invalid request body",
    });
  }

  try {
    // Ensure categories is an array
    if (categories && !Array.isArray(categories)) {
      console.error('Categories is not an array:', categories);
      return res.status(400).json({ error: 'categories must be an array' });
    }

    // Ensure tags is an array
    if (tags && !Array.isArray(tags)) {
      console.error('Tags is not an array:', tags);
      return res.status(400).json({ error: 'tags must be an array' });
    }

    const newBlog = await createBlogPost(
      title,
      content,
      author_id,
      image_url,
      tags,
      categories
    );

     // Transform the response to only include author's name and email
     const responseBlog = {
      ...newBlog,
      author: {
        id: newBlog.author.id,
        name: newBlog.author.name,
        email: newBlog.author.email
      }
    };

    res.status(201).json({
      status: "success",
      status_code: 201,
      message: "Blog post created successfully",
      data: {
        blog: responseBlog,
      },
    });
  } catch (error) {
    if (error.message.includes("token")) {
      return res.status(401).json({
        status: "error",
        status_code: 401,
        message: "Authentication required",
      });
    }

    console.error("Internal Server Error:", error);

    res.status(500).json({
      status: "unsuccessful",
      status_code: 500,
      message: error.message,
    });
  }
};
