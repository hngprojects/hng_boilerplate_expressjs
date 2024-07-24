// import AppDataSource from '../data-source';
// import { Blog } from '../models/blog';

// const blogRepository = AppDataSource.getRepository(Blog);

// export const getUpdatedBlog = async (): Promise<Blog[]> => {
//   return blogRepository.find({
//     relations: ["comments", "tags", "likes", "category", "author"],
//     order: {
//       updated_at: "DESC"
//     }
//   });
// };

import AppDataSource from '../data-source';
import { Blog } from '../models/blog';


const blogRepository = AppDataSource.getRepository(Blog);

export const getAllUpdatedBlogs = async (page: number, limit: number) => {
    // const blogRepository = getRepository(Blog);
    const offset = (page - 1) * limit;

    const [blogs, total] = await blogRepository.findAndCount({
        order: {
            updated_at: 'DESC',
        },
        skip: offset,
        take: limit,
    });

    return {
        blogs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    };
};
