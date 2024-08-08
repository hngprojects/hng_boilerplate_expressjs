import { getAllComments } from "../services/blogComment.services";
import AppDataSource from "../data-source";
import { ResourceNotFound } from "../middleware";

jest.mock("../data-source", () => ({
  __esModule: true,
  default: {
    getRepository: jest.fn(),
    initialize: jest.fn().mockResolvedValue(true),
  },
  initializeDataSource: jest.fn().mockResolvedValue(true),
}));

describe("getAllComments", () => {
  let blogRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    await AppDataSource.initialize();
    blogRepository = {
      findOne: jest.fn(),
    };
    AppDataSource.getRepository = jest.fn().mockReturnValue(blogRepository);
  });

  it("should get all comments for a blog", async () => {
    const blogId = "1";

    const blog = {
      id: blogId,
      comments: [
        {
          id: 1,
          content: "Comment 1",
          created_at: new Date("2022-01-01T00:00:00.000Z"),
          author: { name: "Author 1" },
        },
        {
          id: 2,
          content: "Comment 2",
          created_at: new Date("2022-01-01T00:00:00.000Z"),
          author: { name: "Author 2" },
        },
      ],
    };

    blogRepository.findOne.mockResolvedValue(blog);

    const comments = await getAllComments(blogId);

    expect(comments).toHaveLength(2);
    expect(comments[0].id).toBe(1);
    expect(comments[0].author).toBe("Author 1");
    expect(comments[0].text).toBe("Comment 1");
    expect(comments[0].timestamp).toBe("2022-01-01T00:00:00.000Z");

    expect(comments[1].id).toBe(2);
    expect(comments[1].author).toBe("Author 2");
    expect(comments[1].text).toBe("Comment 2");
    expect(comments[1].timestamp).toBe("2022-01-01T00:00:00.000Z");
  });

  it("should throw ResourceNotFound if blog is not found", async () => {
    const blogId = "1";

    blogRepository.findOne.mockResolvedValue(null);

    await expect(getAllComments(blogId)).rejects.toThrow(ResourceNotFound);
  });
});
