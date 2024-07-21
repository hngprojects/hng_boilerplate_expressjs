// src/controllers/CategoryController.ts
import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { validateCategoryParams } from '../utils/validateCategoryParams';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  public async createCategory(req: Request, res: Response) {
    try {
      const { name, description, slug, parent_id } = req.body;

      if (!name || !description || !slug) {
        return res.status(400).json({
          status_code: 400,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required fields.',
          },
        });
      }

      const category = await this.categoryService.createCategory({
        name,
        description,
        slug,
        parent_id,
      });

      return res.status(201).json({
        status_code: 201,
        category,
      });
    } catch (error) {
      return res.status(500).json({
        status_code: 500,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while processing your request.',
          details: {
            support_email: 'support@example.com',
          },
        },
      });
    }
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const validation = validateCategoryParams(req.query);

      if (!validation.isValid) {
        return res.status(400).json(validation.error);
      }

      const { limit, offset, parent_id } = req.query;

      const categories = await this.categoryService.getAllCategories(
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined,
        parent_id ? parseInt(parent_id as string) : undefined
      );

      res.status(200).json({
        status_code: 200,
        categories,
      });
    } catch (error) {
      res.status(500).json({
        status_code: 500,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while processing your request.',
          details: {
            support_email: 'support@example.com',
          },
        },
      });
    }
  }
}
