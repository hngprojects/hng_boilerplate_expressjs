// src/__tests__/getOrganizationsByUserId.test.ts
import request from "supertest";
import express from "express";
import { OrgController } from "../controllers/OrgController";
import { Organization } from "../models/organization";
import AppDataSource from "../data-source";
import jwt from "jsonwebtoken";
import config from "../config";
import dotenv from "dotenv";
dotenv.config();

const tokenSecret = config.TOKEN_SECRET;
// Mock data source
jest.mock("../data-source", () => {
  const actualDataSource = jest.requireActual("../data-source");
  return {
    ...actualDataSource,
    getRepository: jest.fn().mockReturnValue({
      find: jest.fn(),
    }),
    initialize: jest.fn().mockResolvedValue(null),
  };
});

// Mock logger
jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const app = express();
app.use(express.json());
const orgController = new OrgController();
app.get(
  "/api/v1/users/:id/organizations",
  orgController.getOrganizations.bind(orgController),
);

// Test Suite
describe("GET /api/v1/users/:id/organizations", () => {
  let token: string;
  const userId = "1a546056-6d6b-4f4a-abc0-0a911467c8c7";
  const organizations = [
    {
      id: "org1",
      name: "Org One",
      slug: "org-one",
      owner_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: "org2",
      name: "Org Two",
      slug: "org-two",
      owner_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  beforeAll(() => {
    token = jwt.sign({ userId }, "6789094837hfvg5hn54g8743ry894w4", {
      expiresIn: "1h",
    });
    const organizationRepository = AppDataSource.getRepository(Organization);
    (organizationRepository.find as jest.Mock).mockResolvedValue(organizations);
  });

  it("should return 200 and the organizations for the user", async () => {
    const response = await request(app)
      .get(`/api/v1/users/${userId}/organizations`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("unsuccessful");
    expect(response.body.message).toBe(
      "Invalid user ID or authentication mismatch.",
    );
  });

  it("should return 400 if user ID does not match token", async () => {
    const response = await request(app)
      .get(`/api/v1/users/invalid-user-id/organizations`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("unsuccessful");
    expect(response.body.message).toBe(
      "Invalid user ID or authentication mismatch.",
    );
  });

  it("should return 500 if there is a server error", async () => {
    const organizationRepository = AppDataSource.getRepository(Organization);
    (organizationRepository.find as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const response = await request(app)
      .get(`/api/v1/users/${userId}/organizations`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("unsuccessful");
    expect(response.body.message).toBe(
      "Invalid user ID or authentication mismatch.",
    );
  });
});
