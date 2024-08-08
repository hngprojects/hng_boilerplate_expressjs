// @ts-nocheck
import { NextFunction, Request, Response } from "express";
import { Repository } from "typeorm";
import { validate as mockUuidValidate } from "uuid";
import { UserController } from "../controllers/UserController";
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";
import { User } from "../models";
import { UserService } from "../services";

jest.mock("../data-source", () => ({
  getRepository: jest.fn(),
}));

jest.mock("uuid", () => ({
  validate: jest.fn(),
}));

describe("UserService", () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<Repository<User>>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
      ...jest.requireActual("typeorm").Repository.prototype,
    } as jest.Mocked<Repository<User>>;

    req = {
      user: { id: "0863d5e0-7f92-4c18-bdd9-6eaa81e73529" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    mockUuidValidate.mockReturnValue(true);
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      userRepositoryMock,
    );
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Unit Test For Users", () => {
    describe("softDeleteUser", () => {
      it("should soft delete a user", async () => {
        const user: User = { id: "123", is_deleted: false } as User;
        userRepositoryMock.findOne.mockResolvedValue(user);
        userRepositoryMock.softDelete.mockResolvedValue({ affected: 1 } as any);

        const result = await userService.softDeleteUser("123");

        expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
          where: { id: "123" },
        });
        expect(userRepositoryMock.save).toHaveBeenCalledWith({
          ...user,
          is_deleted: true,
        });
        expect(userRepositoryMock.softDelete).toHaveBeenCalledWith({
          id: "123",
        });
        expect(result).toEqual({ affected: 1 });
      });

      it("should throw a 404 error if user not found", async () => {
        userRepositoryMock.findOne.mockResolvedValue(null);

        await expect(userService.softDeleteUser("123")).rejects.toThrow(
          new HttpError(404, "User Not Found"),
        );

        expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
          where: { id: "123" },
        });
        expect(userRepositoryMock.save).not.toHaveBeenCalled();
        expect(userRepositoryMock.softDelete).not.toHaveBeenCalled();
      });
    });

    // describe("getProfile for authenticated user", () => {
    //   it("should return 400 if user id format is invalid", async () => {
    //     mockUuidValidate.mockReturnValue(false);

    //     // await UserController.getProfile(req as Request, res as Response, next);

    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.json).toHaveBeenCalledWith({
    //       status_code: 400,
    //       error: "Unauthorized! Invalid User Id Format",
    //     });
    //   });

    //   it("should return 404 if user is not found", async () => {
    //     userRepositoryMock.findOne.mockResolvedValue(null);

    //     await UserController.getProfile(req as Request, res as Response, next);

    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.json).toHaveBeenCalledWith({
    //       status_code: 404,
    //       error: "User Not Found!",
    //     });
    //   });

    //   it("should return 404 if user is soft deleted", async () => {
    //     const user: User = {
    //       id: "0863d5e0-7f92-4c18-bdd9-6eaa81e73529",
    //       is_deleted: true,
    //     } as User;
    //     userRepositoryMock.findOne.mockResolvedValue(user);

    //     await UserController.getProfile(req as Request, res as Response, next);

    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.json).toHaveBeenCalledWith({
    //       status_code: 404,
    //       error: "User not found!",
    //     });
    //   });

    //   it("should return user profile details", async () => {
    //     const user: User = {
    //       id: "0863d5e0-7f92-4c18-bdd9-6eaa81e73529",
    //       name: "Test User",
    //       email: "test@example.com",
    //       role: "user",
    //       profile: {
    //         id: "profile-id",
    //         first_name: "Test",
    //         last_name: "User",
    //         phone_number: "1234567890",
    //         avatarUrl: "http://example.com/avatar.png",
    //       },
    //     } as User;
    //     userRepositoryMock.findOne.mockResolvedValue(user);

    //     await UserController.getProfile(req as Request, res as Response, next);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //       status_code: 200,
    //       message: "User profile details retrieved successfully",
    //       data: {
    //         id: user.id,
    //         name: user.name,
    //         email: user.email,
    //         role: user.role,
    //         profile_id: user.profile?.id,
    //         first_name: user.profile?.first_name,
    //         last_name: user.profile?.last_name,
    //         phone_number: user.profile?.phone_number,
    //         avatar_url: user.profile?.avatarUrl,
    //       },
    //     });
    //   });

    //   it("should return 500 if there is an internal server error", async () => {
    //     userRepositoryMock.findOne.mockRejectedValue(new Error("Test Error"));

    //     await UserController.getProfile(req as Request, res as Response, next);

    //     expect(res.status).toHaveBeenCalledWith(500);
    //     expect(res.json).toHaveBeenCalledWith({
    //       status_code: 500,
    //       error: "Internal Server Error",
    //     });
    //   });
    // });
  });
});

describe("UserService - updateUserTimezone", () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      ...jest.requireActual("typeorm").Repository.prototype,
    } as jest.Mocked<Repository<User>>;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      userRepositoryMock,
    );
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update the user's timezone successfully", async () => {
    const user: User = { id: "123", timezone: {} } as User;
    userRepositoryMock.findOne.mockResolvedValue(user);

    const timezoneData = {
      timezone: "America/New_York",
      gmtOffset: "-05:00",
      description: "Eastern Standard Time",
    };

    await userService.updateUserTimezone("123", timezoneData);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: "123" },
    });
    expect(userRepositoryMock.save).toHaveBeenCalledWith({
      ...user,
      timezone: timezoneData,
    });
  });

  it("should throw a 404 error if user not found", async () => {
    userRepositoryMock.findOne.mockResolvedValue(null);

    const timezoneData = {
      timezone: "America/New_York",
      gmtOffset: "-05:00",
      description: "Eastern Standard Time",
    };

    await expect(
      userService.updateUserTimezone("123", timezoneData),
    ).rejects.toThrow(new HttpError(404, "User not found"));

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: "123" },
    });
    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });
});
