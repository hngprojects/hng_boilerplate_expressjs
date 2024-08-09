//@ts-nocheck
import { Request, Response } from "express";
import { OrgController } from "../controllers";
import { OrgService } from "../services";
import { Organization, UserOrganization, User } from "../models";
import AppDataSource from "../data-source";

jest.mock("../data-source");

describe("OrgService", () => {
  let orgService: OrgService;

  beforeAll(() => {
    orgService = new OrgService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // it('should remove user from organization', async () => {
  //   const mockUser = { id: 'user_id' } as User;
  //   const mockUserOrganization = {
  //     userId: 'user_id',
  //     organizationId: 'org_id',
  //     user: mockUser,
  //   } as UserOrganization;

  //   const userOrganizationRepository = {
  //     findOne: jest.fn().mockResolvedValue(mockUserOrganization),
  //     remove: jest.fn().mockResolvedValue(null),
  //   };
  //   const organizationRepository = {
  //     findOne: jest.fn().mockResolvedValue(null),
  //     save: jest.fn().mockResolvedValue(null),
  //   };

  //   (AppDataSource.getRepository as jest.Mock)
  //     .mockImplementation((entity) => {
  //       if (entity === UserOrganization) return userOrganizationRepository;
  //       if (entity === Organization) return organizationRepository;
  //       return {};
  //     });

  //   const result = await orgService.removeUser('org_id', 'user_id');
  //   expect(result).toBe(mockUser);
  //   expect(userOrganizationRepository.findOne).toHaveBeenCalledWith({
  //     where: { userId: 'user_id', organizationId: 'org_id' },
  //     relations: ['user', 'organization'],
  //   });
  //   expect(userOrganizationRepository.remove).toHaveBeenCalledWith(mockUserOrganization);
  //   // expect(organizationRepository.findOne).toHaveBeenCalledWith({
  //   //   where: { id: 'org_id', owner_id: 'user_id' },
  //   //   relations: ['users'],
  //   // });
  // });

  it("should return null if user organization not found", async () => {
    const userOrganizationRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === UserOrganization) return userOrganizationRepository;
      return {};
    });

    const result = await orgService.removeUser("org_id", "user_id");
    expect(result).toBeNull();
    expect(userOrganizationRepository.findOne).toHaveBeenCalledWith({
      where: { userId: "user_id", organizationId: "org_id" },
      relations: ["user", "organization"],
    });
  });

  it("should throw an error on failure", async () => {
    const userOrganizationRepository = {
      findOne: jest.fn().mockRejectedValue(new Error("Database error")),
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === UserOrganization) return userOrganizationRepository;
      return {};
    });

    await expect(orgService.removeUser("org_id", "user_id")).rejects.toThrow(
      "Failed to remove user from organization",
    );
  });
});
