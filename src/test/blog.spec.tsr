import { Repository, DeleteResult } from "typeorm";
import AppDataSource from "../data-source";
import { Blog } from "../models/blog";
import { BlogService } from "../services";
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';

jest.mock("../data-source", () => ({
  __esModule: true, // This property indicates that the module is an ES module
  default: {
    getRepository: jest.fn(),
    initialize: jest.fn(),
    isInitialized: false,
  },
}));

describe("BlogService", () => {
  let blogService: BlogService;
  let mockRepository: jest.Mocked<Repository<Blog>>;

  beforeEach(() => {
    mockRepository = {
      delete: jest.fn(),
      // Add other methods if needed
    } as any; // Casting to any to match the mocked repository

    // Mock the return value of AppDataSource.getRepository
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

    // Initialize the BlogService after setting up the mock
    blogService = new BlogService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("deleteBlogPost", () => {
    it("should successfully delete a blog post", async () => {
      const id = "some-id";
      const deleteResult: DeleteResult = { 
        affected: 1,
        raw: [], // Provide an empty array or appropriate mock value
      };

      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await blogService.deleteBlogPost(id);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });

    it("should return false when the blog post does not exist", async () => {
      const id = "non-existing-id";
      const deleteResult: DeleteResult = {
        affected: 0,
        raw: [], // Provide an empty array or appropriate mock value
      };

      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await blogService.deleteBlogPost(id);

      expect(result).toBe(false);
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });

    it("should throw an error if there is an issue with deletion", async () => {
      const id = "some-id";
      const error = new Error("Deletion failed");

      mockRepository.delete.mockRejectedValue(error);

      await expect(blogService.deleteBlogPost(id)).rejects.toThrow("Error deleting blog post");
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
