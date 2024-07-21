import { Category } from '../models/Category';

export class CategoryService {
    public async createCategory(data: {
        name: string;
        description: string;
        slug: string;
        parent_id?: number;
      }): Promise<Category> {
        const category = new Category();
        category.name = data.name;
        category.description = data.description;
        category.slug = data.slug;
    
        if (data.parent_id) {
          const parentCategory = await Category.findOne({ where: { id: data.parent_id } });
          if (parentCategory) {
            category.parent = parentCategory;
          }
        }
    
        return await category.save();
      }
  
    public async getAllCategories(limit?: number, offset?: number, parent_id?: number): Promise<Category[]> {
        const queryOptions: any = {
        order: { name: 'ASC' },
        relations: ['parent', 'children'],
        };

        if (parent_id !== undefined) {
        queryOptions.where = { parent_id };
        }

        if (limit !== undefined) {
        queryOptions.take = limit;
        }

        if (offset !== undefined) {
        queryOptions.skip = offset;
        }

        return await Category.find(queryOptions);
    }
}
