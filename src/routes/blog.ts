// src/routes/blogRoute.ts
import { Router } from "express";
import { getPaginatedBlogs } from "../controllers/BlogController"; 
import { methodNotAllowed } from "../middleware";

const blogRoute = Router();

blogRoute.post("/");
blogRoute.get("/", getPaginatedBlogs);
blogRoute.all("/", methodNotAllowed); 

export { blogRoute };
