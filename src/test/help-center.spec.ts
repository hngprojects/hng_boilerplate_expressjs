//@ts-nocheck

import { HelpService } from "../services";
import { HelpCenterEntity } from "../models";
import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";

jest.mock("../data-source", () => {
  return {
    getRepository: jest.fn(),
  };
});

describe("HelpService", () => {
  let helpService: HelpService;
  let helpRepository: Repository<HelpCenterEntity>;

  beforeEach(() => {
    helpRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    } as any;
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(helpRepository);
    helpService = new HelpService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new article", async () => {
      const title = "New Article";
      const content = "Content of the new article";
      const author = "Author";
      const article = { id: "1", title, content, author };

      (helpRepository.findOne as jest.Mock).mockResolvedValue(null);
      (helpRepository.create as jest.Mock).mockReturnValue(article);
      (helpRepository.save as jest.Mock).mockResolvedValue(article);

      const result = await helpService.create(title, content, author);

      expect(helpRepository.findOne).toHaveBeenCalledWith({
        where: { title },
      });
      expect(helpRepository.create).toHaveBeenCalledWith({
        title,
        content,
        author,
      });
      expect(helpRepository.save).toHaveBeenCalledWith(article);
      expect(result.article).toEqual(article);
    });

    it("should throw an error if the title already exists", async () => {
      const title = "Existing Article";
      const content = "Content";
      const author = "Author";
      const existingArticle = { id: "1", title, content, author };

      (helpRepository.findOne as jest.Mock).mockResolvedValue(existingArticle);

      await expect(helpService.create(title, content, author)).rejects.toThrow(
        HttpError,
      );
    });
  });

  describe("getAll", () => {
    it("should return all articles", async () => {
      const articles = [
        {
          id: "1",
          title: "Article 1",
          content: "Content 1",
          author: "Author 1",
        },
        {
          id: "2",
          title: "Article 2",
          content: "Content 2",
          author: "Author 2",
        },
      ];

      (helpRepository.find as jest.Mock).mockResolvedValue(articles);

      const result = await helpService.getAll();

      expect(helpRepository.find).toHaveBeenCalled();
      expect(result.articles).toEqual(articles);
    });
  });

  describe("update", () => {
    it("should throw an error if the article does not exist", async () => {
      const id = "non-existing-id";
      const title = "Title";
      const content = "Content";
      const author = "Author";

      (helpRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        helpService.update(id, title, content, author),
      ).rejects.toThrow(HttpError);
    });
  });

  describe("getTopicById", () => {
    it("should return the article if it exists", async () => {
      const id = "1";
      const existingArticle = {
        id,
        title: "Title",
        content: "Content",
        author: "Author",
      };

      (helpRepository.findOne as jest.Mock).mockResolvedValue(existingArticle);

      const result = await helpService.getTopicById(id);

      expect(helpRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result.article).toEqual(existingArticle);
    });

    it("should throw a HttpError if the article does not exist", async () => {
      const id = "non-existing-id";

      (helpRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(helpService.getTopicById(id)).rejects.toThrow(HttpError);
      await expect(helpService.getTopicById(id)).rejects.toThrow("Not Found");
      expect(helpRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
