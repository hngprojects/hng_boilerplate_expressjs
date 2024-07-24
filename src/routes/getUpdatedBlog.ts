// import { Router } from 'express';
// import { UpdatedBlogController } from'../controllers/UpdatedBlogController';
// import { authMiddleware } from '../middleware';

// const getUpdatedBlogsRouter = Router();

// getUpdatedBlogsRouter.get('/blog', authMiddleware, UpdatedBlogController);

// export default  getUpdatedBlogsRouter ;

import { Router } from 'express';
import { UpdatedBlogController } from '../controllers/UpdatedBlogController';
import { authMiddleware } from '../middleware/auth';

const getUpdatedBlogsRouter = Router();

getUpdatedBlogsRouter.get('/blogs',  UpdatedBlogController.getAllUpdatedBlogs);

export default getUpdatedBlogsRouter;
