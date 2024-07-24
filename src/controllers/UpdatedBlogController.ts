// import { Request, Response } from 'express';
// import { getUpdatedBlog } from '../services/updatedBlog.services';

// export const getUpdatedBlog= async (req: Request, res: Response): Promise<void> => {
//   try {
//     const blogs = await getUpdatedBlog();
//     res.status(200).json({ status: 'success', data: blogs });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: 'Failed to fetch updated blogs', error });
//   }
// };

import { Request, Response } from 'express';
import { getAllUpdatedBlogs } from '../services/updatedBlog.services';

export class UpdatedBlogController {
    static getAllUpdatedBlogs = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try {
            const result = await getAllUpdatedBlogs(page, limit);

            return res.status(200).json({
                message: 'Blogs retrieved successfully',
                data: result,
            });
        } catch (error) {
            console.error('Error retrieving blogs:', error);
            return res.status(500).json({ message: 'Internal server error', error });
        }
    };
}
