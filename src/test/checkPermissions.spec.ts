//@ts-nocheck
import { Request, Response, NextFunction } from "express";
import { checkPermissions } from "../middleware/";
import { UserRole } from "../enums/userRoles";
import { User } from "../models";
import AppDataSource from "../data-source";
import jwt from "jsonwebtoken";

jest.mock("../data-source");

describe("checkPermissions middleware", () => {
  let req: Request & { user?: User };
  let res: Response;
  let next: NextFunction;
  let userRepositoryMock: any;

  beforeEach(() => {
    req = {
      headers: {},
      user: undefined,
    } as unknown as Request & { user?: User };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();

    userRepositoryMock = {
      findOne: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      userRepositoryMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should allow access if user has required role", async () => {
    const token = "valid-jwt-token";
    const decodedToken = { userId: "user-id" };
    const mockUser = { id: "user-id", role: UserRole.ADMIN };

    req.headers.authorization = `Bearer ${token}`;
    jest.spyOn(jwt, "decode").mockReturnValue(decodedToken);
    userRepositoryMock.findOne.mockResolvedValue(mockUser);

    const middleware = checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should deny access if user does not have required role", async () => {
    const token = "valid-jwt-token";
    const decodedToken = { userId: "user-id" };
    const mockUser = { id: "user-id", role: UserRole.USER };

    req.headers.authorization = `Bearer ${token}`;
    jest.spyOn(jwt, "decode").mockReturnValue(decodedToken);
    userRepositoryMock.findOne.mockResolvedValue(mockUser);

    const middleware = checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Access denied. Not an admin",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should deny access if token is invalid", async () => {
    const token = "invalid-jwt-token";

    req.headers.authorization = `Bearer ${token}`;
    jest.spyOn(jwt, "decode").mockReturnValue(null);

    const middleware = checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Access denied. Invalid token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should deny access if user is not found", async () => {
    const token = "valid-jwt-token";
    const decodedToken = { userId: "user-id" };

    req.headers.authorization = `Bearer ${token}`;
    jest.spyOn(jwt, "decode").mockReturnValue(decodedToken);
    userRepositoryMock.findOne.mockResolvedValue(null);

    const middleware = checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Access denied. Not an admin",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
