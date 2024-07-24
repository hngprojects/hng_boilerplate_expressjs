import { Repository, DeleteResult } from "typeorm";
import AppDataSource from "../data-source";
import { Blog } from "../models/blog";
import { BlogService } from "../services";
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';

jest.mock("../data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("BlogService", () => {
  let blogService: BlogService;
  let mockRepository: jest.Mocked<Repository<Blog>>;

  beforeEach(() => {
    blogService = new BlogService();

    mockRepository = {
      delete: jest.fn(),
      // add other methods if needed
    } as any; // casting to any to match the mocked repository
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
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
