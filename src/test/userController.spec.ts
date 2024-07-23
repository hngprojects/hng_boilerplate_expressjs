import request from 'supertest';
import { getConnection } from "typeorm";
import { User } from "../models/user";
import { UserRole } from "../enums/userRoles";
import server from "../index";
import AppDataSource from "../data-source";

// Mock Data
const superAdminToken = "superAdminToken";
const userToken = "userToken";
const nonExistentUserId = "nonExistentUserId";
const userIdToDelete = "userIdToDelete";

// Mock the Authentication and Authorization Middleware
jest.mock("../middleware/auth", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    if (req.headers.authorization === `Bearer ${superAdminToken}`) {
      req.user = { id: "superAdminId", role: UserRole.SUPER_ADMIN };
    } else if (req.headers.authorization === `Bearer ${userToken}`) {
      req.user = { id: "userId", role: UserRole.USER };
    }
    next();
  }
}));

jest.mock("../middleware/checkUserRole", () => ({
  checkPermissions: (roles: UserRole[]) => (req: any, res: any, next: any) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        status: 403,
        message: "Forbidden: Super admin access required",
      });
    }
  }
}));

describe("User Controller - deleteUser", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(async () => {
    await getConnection().synchronize(true);
  });

  test("Super admin should be able to delete a user", async () => {
    // Create a new user
    const user = new User();
    user.id = userIdToDelete;
    user.name = "John Smith";
    user.email = "john.doe@gmail.com";
    user.password = "password123";

    await AppDataSource.getRepository(User).save(user);

    const response = await request(server)
      .delete(`/api/v1/users/${user.id}`)
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 200,
      message: "User deleted successfully",
    });

    // Check if the user is deleted from the database
    const deletedUser = await AppDataSource.getRepository(User).findOne({ where: { id: user.id } });
    expect(deletedUser).toBeNull();
  });

  test("User should not be able to delete a user", async () => {
    // Create a new user
    const user = new User();
    user.id = userIdToDelete;
    user.name = "John Smith";
    user.email = "jsmith@gmail.com";
    user.password = "password123";

    await AppDataSource.getRepository(User).save(user);

    const response = await request(server)
      .delete(`/api/v1/users/${user.id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      status: 403,
      message: "Forbidden: Super admin access required",
    });
  });

  test("Non-existent user ID should return a 404 error", async () => {
    const response = await request(server)
      .delete(`/api/v1/users/${nonExistentUserId}`)
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 404,
      message: "User not found",
    });
  });

  test("Should return a 401 if the user is not authenticated", async () => {
    const response = await request(server)
      .delete(`/api/v1/users/${userIdToDelete}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status_code: 401,
      message: "Invalid token",
    });
  });

  test("Should return a 401 if the token is invalid", async () => {
    const response = await request(server)
      .delete(`/api/v1/users/${userIdToDelete}`)
      .set("Authorization", "Bearer invalidToken");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status_code: 401,
      message: "Invalid token",
    });
  });

  test("Should return a 500 if there is a server error", async () => {
    jest.spyOn(AppDataSource.getRepository(User), "delete").mockRejectedValueOnce(new Error("Server error"));

    const response = await request(server)
      .delete(`/api/v1/users/${userIdToDelete}`)
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 500,
      message: "Internal server error",
    });
  });
});