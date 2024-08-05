import request from "supertest";
import app from "../app";
import { UserService } from "../services";
import { User } from "../models";
import AppDataSource from "../data-source";
import { BadRequest } from "../middleware";

jest.mock("../services/UserService");

describe("UserController.updateProfile", () => {
  let userId: string;
  let mockUser: User;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    userId = "valid-user-id";
    mockUser = {
      id: userId,
      first_name: "John",
      last_name: "Doe",
      profile: {
        id: "profile-id",
        username: "johndoe",
        bio: "A short bio",
        jobTitle: "Developer",
        language: "English",
        pronouns: "he/him",
        department: "Engineering",
        social_links: ["https://twitter.com/johndoe"],
        timezones: "UTC",
      },
    } as User;
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it("should update the user profile successfully", async () => {
    (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);
    (UserService.updateUserById as jest.Mock).mockResolvedValue({
      ...mockUser,
      first_name: "Jane",
    });

    const response = await request(app)
      .put("/api/v1/users/me")
      .set("Authorization", `Bearer valid-token`)
      .send({
        first_name: "Jane",
        last_name: "Doe",
        username: "janedoe",
        bio: "A new bio",
        jobTitle: "Senior Developer",
        language: "French",
        pronouns: "she/her",
        department: "Engineering",
        social_links: ["https://twitter.com/janedoe"],
        timezones: "CET",
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: userId,
      first_name: "Jane",
      last_name: "Doe",
      profile_id: "profile-id",
      username: "janedoe",
      bio: "A new bio",
      jobTitle: "Senior Developer",
      language: "French",
      pronouns: "she/her",
      department: "Engineering",
      social_links: ["https://twitter.com/janedoe"],
      timezones: "CET",
    });
  });

  it("should return 404 if user is not found", async () => {
    (UserService.getUserById as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .put("/api/v1/users/me")
      .set("Authorization", `Bearer valid-token`)
      .send({
        first_name: "Jane",
        last_name: "Doe",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User Not Found!");
  });

  it("should return 400 for invalid user ID format", async () => {
    (UserService.getUserById as jest.Mock).mockImplementation(() => {
      throw new BadRequest("Unauthorized! Invalid User Id Format");
    });

    const response = await request(app)
      .put("/api/v1/users/me")
      .set("Authorization", `Bearer valid-token`)
      .send({
        first_name: "Jane",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Unauthorized! Invalid User Id Format");
  });
});
