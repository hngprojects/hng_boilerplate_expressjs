import { createRole } from "../services/role.services";
import { User } from "../models";
import { UserRole } from "../enums/userRoles";
import { HttpError } from "../middleware/error";

jest.mock("../models");

describe("Role Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRole", () => {
    it("should update user role successfully", async () => {
      const mockUser = {
        id: "123",
        role: UserRole.USER,
        save: jest.fn(),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await createRole("123", UserRole.ADMIN);

      expect(User.findOne).toHaveBeenCalledWith({ where: { id: "123" } });
      expect(mockUser.role).toBe(UserRole.ADMIN);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should throw HttpError if user is not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(createRole("123", UserRole.ADMIN)).rejects.toThrow(
        new HttpError(404, "User not found"),
      );
    });

    it("should throw HttpError if invalid role is specified", async () => {
      const mockUser = {
        id: "123",
        role: UserRole.USER,
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        createRole("123", "INVALID_ROLE" as UserRole),
      ).rejects.toThrow(new HttpError(400, "Invalid role specified"));
    });

    it("should database errors", async () => {
      (User.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(createRole("123", UserRole.ADMIN)).rejects.toThrow(
        "Database error",
      );
    });
  });
});
