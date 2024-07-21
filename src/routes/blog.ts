// src/routes/blogRoute.ts
import { Router } from "express";
import { getPaginatedBlogs } from "../controllers/BlogController"; // Ensure the path is correct
import { methodNotAllowed } from "../middleware";


const blogRoute = Router();

blogRoute.get("/", getPaginatedBlogs);
blogRoute.all("/", methodNotAllowed); 


export { blogRoute };
