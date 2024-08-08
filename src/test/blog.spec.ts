import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { DeleteResult, Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Category, Tag, User } from "../models";
import { Blog } from "../models/blog";
import { BlogService } from "../services";

jest.mock("../data-source", () => ({
  __esModule: true,
  default: {
    getRepository: jest.fn(),
    initialize: jest.fn(),
    isInitialized: false,
  },
}));

jest.mock("../models");

describe("BlogService", () => {
  let blogService: BlogService;
  let blogRepositoryMock: jest.Mocked<Repository<Blog>>;
  let tagRepositoryMock: jest.Mocked<Repository<Tag>>;
  let categoryRepositoryMock: jest.Mocked<Repository<Category>>;
  let userRepositoryMock: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    blogRepositoryMock = {
      delete: jest.fn(),
      save: jest.fn(),
      // Add other methods if needed
    } as any; // Casting to any to match the mocked repository
    tagRepositoryMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any;
    categoryRepositoryMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any;
    userRepositoryMock = {
      findOne: jest.fn(),
    } as any;
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Blog) return blogRepositoryMock;
      if (entity === User) return userRepositoryMock;
      if (entity === Tag) return tagRepositoryMock;
      if (entity === Category) return categoryRepositoryMock;
    });

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

      blogRepositoryMock.delete.mockResolvedValue(deleteResult);

      const result = await blogService.deleteBlogPost(id);

      expect(result).toBe(true);
      expect(blogRepositoryMock.delete).toHaveBeenCalledWith(id);
    });

    it("should return false when the blog post does not exist", async () => {
      const id = "non-existing-id";
      const deleteResult: DeleteResult = {
        affected: 0,
        raw: [], // Provide an empty array or appropriate mock value
      };

      blogRepositoryMock.delete.mockResolvedValue(deleteResult);

      const result = await blogService.deleteBlogPost(id);

      expect(result).toBe(false);
      expect(blogRepositoryMock.delete).toHaveBeenCalledWith(id);
    });

    it("should throw an error if there is an issue with deletion", async () => {
      const id = "some-id";
      const error = new Error("Deletion failed");

      blogRepositoryMock.delete.mockRejectedValue(error);

      await expect(blogService.deleteBlogPost(id)).rejects.toThrow(
        "Error deleting blog post",
      );
      expect(blogRepositoryMock.delete).toHaveBeenCalledWith(id);
    });
  });

  describe("createBlogPost", () => {
    it("should create a new blogpost with tags and categories", async () => {
      const payload = {
        title: "Test Blog",
        content: "This is a test blog",
        authorId: "user-1",
        image_url: "http://example.com",
        tags: "tag-1,tag-2",
        categories: "category-1,category-2",
      };

      const mockUser = { id: payload.authorId } as User;
      const mockTag = { name: "tag-1" } as Tag;
      const mockTag2 = { name: "tag-2" } as Tag;
      const mockCategory = { name: "category-1" } as Category;
      const mockCategory2 = { name: "category-2" } as Category;

      userRepositoryMock.findOne.mockResolvedValue(mockUser);
      tagRepositoryMock.findOne.mockResolvedValue(null);
      tagRepositoryMock.create.mockImplementation((tagData) => tagData as Tag);
      tagRepositoryMock.save.mockImplementation((tag) =>
        Promise.resolve({
          id: 1,
          blogs: tag.blogs as any,
          name: tag.name as any,
        }),
      );
      categoryRepositoryMock.findOne.mockResolvedValue(null);
      categoryRepositoryMock.create.mockImplementation(
        (categoryData) => categoryData as Category,
      );

      categoryRepositoryMock.save.mockImplementation((category) =>
        Promise.resolve(category as any),
      );

      const expectedBlog = {
        id: "some-id",
        title: payload.title,
        content: payload.content,
        image_url: payload.image_url,
        author: mockUser,
        tags: [mockTag, mockTag2],
        categories: [mockCategory, mockCategory2],
        comments: [],
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        published_at: expect.any(Date),
      } as unknown as Blog;

      blogRepositoryMock.save.mockResolvedValue(expectedBlog);

      const response = await blogService.createBlogPost(
        payload.title,
        payload.content,
        payload.authorId,
        payload.image_url,
        payload.tags,
        payload.categories,
      );

      expect(response).toEqual(expectedBlog);
      expect(tagRepositoryMock.findOne).toHaveBeenCalledTimes(2);
      expect(tagRepositoryMock.create).toHaveBeenCalledTimes(2);
      expect(tagRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(categoryRepositoryMock.findOne).toHaveBeenCalledTimes(2);
      expect(categoryRepositoryMock.create).toHaveBeenCalledTimes(2);
      expect(categoryRepositoryMock.save).toHaveBeenCalledTimes(2);
    });
  });
});
