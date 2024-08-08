import express from "express";
import request from "supertest";
import { Router } from "express";

const mockSqueezeService = {
  getSqueezeById: jest.fn(),
};

const app = express();
app.use(express.json());

const squeezeRouter = Router();
squeezeRouter.get("/squeeze/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const squeeze = await mockSqueezeService.getSqueezeById(id);

    if (!squeeze) {
      return res.status(404).json({
        status: "error",
        message: "Squeeze record not found.",
      });
    }

    res.status(200).json({
      status: "success",
      data: squeeze,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the squeeze record.",
      error: error.message,
    });
  }
});

app.use("/api/v1", squeezeRouter);

describe("GET /api/v1/squeeze/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the squeeze data if the record is found", async () => {
    const mockSqueeze = {
      id: "1",
      name: "Test Squeeze",
    };

    mockSqueezeService.getSqueezeById.mockResolvedValue(mockSqueeze);

    const response = await request(app).get("/api/v1/squeeze/1").expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data).toEqual(mockSqueeze);
  });

  it("should return 404 if the squeeze record is not found", async () => {
    mockSqueezeService.getSqueezeById.mockResolvedValue(null);

    const response = await request(app).get("/api/v1/squeeze/999").expect(404);

    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Squeeze record not found.");
  });

  it("should return 500 if an error occurs while retrieving the squeeze", async () => {
    mockSqueezeService.getSqueezeById.mockRejectedValue(
      new Error("Database error"),
    );

    const response = await request(app).get("/api/v1/squeeze/1").expect(500);

    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe(
      "An error occurred while retrieving the squeeze record.",
    );
    expect(response.body.error).toBe("Database error");
  });
});
