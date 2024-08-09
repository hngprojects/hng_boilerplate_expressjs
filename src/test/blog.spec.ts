import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { DeleteResult, Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Category, Tag, User } from "../models";
import { Blog } from "../models/blog";
import { BlogService } from "../services";
import { Forbidden, ResourceNotFound } from "../middleware";

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
      findOne: jest.fn(),
    } as any;
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
        raw: [],
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
        raw: [],
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

  describe("updateBlog", () => {
    it("should update a blog post with new data, tags, and categories", async () => {
      const blogId = "blog-123";
      const userId = "user-456";
      const payload = {
        title: "Updated Blog Title",
        content: "Updated Blog Content",
        image_url: "updated-image.jpg",
        tags: "tag1,tag2",
        categories: "category1,category2",
      };

      const mockUser = { id: userId, name: "User Name" } as User;
      const existingBlog = {
        id: blogId,
        title: "Old Title",
        content: "Old Content",
        image_url: "old-image.jpg",
        author: { id: "user-456", name: "User Name" },
        tags: [],
        categories: [],
        comments: [],
        likes: 0,
      } as unknown as Blog;

      const tag1 = { id: "tag-1", name: "tag1" } as unknown as Tag;
      const tag2 = { id: "tag-2", name: "tag2" } as unknown as Tag;
      const category1 = {
        id: "category-1",
        name: "category1",
      } as unknown as Category;
      const category2 = {
        id: "category-2",
        name: "category2",
      } as unknown as Category;

      blogRepositoryMock.findOne.mockResolvedValue(existingBlog);
      userRepositoryMock.findOne.mockResolvedValue(mockUser);
      tagRepositoryMock.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      categoryRepositoryMock.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      tagRepositoryMock.create
        .mockReturnValueOnce(tag1)
        .mockReturnValueOnce(tag2);
      categoryRepositoryMock.create
        .mockReturnValueOnce(category1)
        .mockReturnValueOnce(category2);
      tagRepositoryMock.save
        .mockResolvedValueOnce(tag1)
        .mockResolvedValueOnce(tag2);
      categoryRepositoryMock.save
        .mockResolvedValueOnce(category1)
        .mockResolvedValueOnce(category2);
      blogRepositoryMock.save.mockResolvedValue({
        ...existingBlog,
        ...payload,
        tags: [tag1, tag2],
        categories: [category1, category2],
      });

      const result = await blogService.updateBlog(blogId, payload, userId);

      expect(blogRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: blogId },
        relations: ["author", "tags", "categories"],
      });
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(tagRepositoryMock.findOne).toHaveBeenCalledTimes(2);
      expect(categoryRepositoryMock.findOne).toHaveBeenCalledTimes(2);
      expect(blogRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...existingBlog,
          ...payload,
          tags: [tag1, tag2],
          categories: [category1, category2],
          author: mockUser,
        }),
      );

      expect(result).toEqual({
        blog_id: blogId,
        title: payload.title,
        content: payload.content,
        tags: [tag1, tag2],
        categories: [category1, category2],
        image_urls: payload.image_url,
        author: mockUser.name,
      });
    });

    it("should throw Forbidden if the user is not authorized to update the blog post", async () => {
      const blogId = "blog-123";
      const userId = "user-789";
      const payload = {
        title: "Updated Blog Title",
        content: "Updated Blog Content",
        image_url: "updated-image.jpg",
        tags: "tag1,tag2",
        categories: "category1,category2",
      };

      const existingBlog = {
        id: blogId,
        title: "Old Title",
        content: "Old Content",
        image_url: "old-image.jpg",
        author: { id: "user-456" },
        tags: [],
        categories: [],
        comments: [],
        likes: 0,
      } as unknown as Blog;

      blogRepositoryMock.findOne.mockResolvedValue(existingBlog);

      await expect(
        blogService.updateBlog(blogId, payload, userId),
      ).rejects.toThrow(Forbidden);
    });

    it("should throw ResourceNotFound if the blog post does not exist", async () => {
      const blogId = "non-existent-blog";
      const userId = "user-456";
      const payload = {};

      blogRepositoryMock.findOne.mockResolvedValue(null);

      await expect(
        blogService.updateBlog(blogId, payload, userId),
      ).rejects.toThrow(ResourceNotFound);
    });

    it("should create new tags and categories if they do not exist", async () => {
      const blogId = "blog-123";
      const userId = "user-456";
      const payload = {
        title: "Updated Blog Title",
        content: "Updated Blog Content",
        image_url: "updated-image.jpg",
        tags: "newTag1,newTag2",
        categories: "newCategory1,newCategory2",
      };

      const mockUser = { id: userId, name: "User Name" } as User;
      const existingBlog = {
        id: blogId,
        tags: [],
        categories: [],
        author: { id: userId },
      } as unknown as Blog;
      const newTag1 = { id: "new-tag-1", name: "newTag1" } as unknown as Tag;
      const newTag2 = { id: "new-tag-2", name: "newTag2" } as unknown as Tag;
      const newCategory1 = {
        id: "new-category-1",
        name: "newCategory1",
      } as unknown as Category;
      const newCategory2 = {
        id: "new-category-2",
        name: "newCategory2",
      } as unknown as Category;

      blogRepositoryMock.findOne.mockResolvedValue(existingBlog);
      userRepositoryMock.findOne.mockResolvedValue(mockUser);
      tagRepositoryMock.findOne.mockResolvedValue(null);
      tagRepositoryMock.create
        .mockReturnValueOnce(newTag1)
        .mockReturnValueOnce(newTag2);
      categoryRepositoryMock.findOne.mockResolvedValue(null);
      categoryRepositoryMock.create
        .mockReturnValueOnce(newCategory1)
        .mockReturnValueOnce(newCategory2);
      tagRepositoryMock.save
        .mockResolvedValueOnce(newTag1)
        .mockResolvedValueOnce(newTag2);
      categoryRepositoryMock.save
        .mockResolvedValueOnce(newCategory1)
        .mockResolvedValueOnce(newCategory2);
      blogRepositoryMock.save.mockResolvedValue({
        ...existingBlog,
        ...payload,
        tags: [newTag1, newTag2],
        categories: [newCategory1, newCategory2],
        author: mockUser,
      });

      const result = await blogService.updateBlog(blogId, payload, userId);

      expect(tagRepositoryMock.save).toHaveBeenCalledWith(newTag1);
      expect(tagRepositoryMock.save).toHaveBeenCalledWith(newTag2);
      expect(categoryRepositoryMock.save).toHaveBeenCalledWith(newCategory1);
      expect(categoryRepositoryMock.save).toHaveBeenCalledWith(newCategory2);
      expect(result.tags).toEqual(expect.arrayContaining([newTag1, newTag2]));
      expect(result.categories).toEqual(
        expect.arrayContaining([newCategory1, newCategory2]),
      );
    });
  });
});
