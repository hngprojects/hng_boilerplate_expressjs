//@ts-nocheck
import { OrgService } from "../services/OrgService";
import { User } from "../models/user";
import { Organization } from "../models/organization";
import AppDataSource from "../data-source";

jest.mock("../data-source");

describe("OrgService", () => {
  let orgService: OrgService;
  let userRepositoryMock: any;
  let organizationRepositoryMock: any;

  beforeEach(() => {
    orgService = new OrgService();
    userRepositoryMock = {
      findOne: jest.fn(),
    };
    organizationRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockImplementation((model) => {
      if (model === User) {
        return userRepositoryMock;
      }
      if (model === Organization) {
        return organizationRepositoryMock;
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should remove a user from an organization", async () => {
    const userId = "user-id";
    const orgId = "org-id";

    const mockUser = {
      id: userId,
      organizations: [{ id: orgId }],
    };
    const mockOrganization = {
      id: orgId,
      users: [{ id: userId }],
    };

    userRepositoryMock.findOne.mockResolvedValue(mockUser);
    organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);

    const result = await orgService.removeUser(orgId, userId);

    expect(result).toEqual(mockUser);
    expect(organizationRepositoryMock.save).toHaveBeenCalledWith({
      ...mockOrganization,
      users: [],
    });
  });

  it("should return null if user does not exist", async () => {
    const userId = "user-id";
    const orgId = "org-id";

    userRepositoryMock.findOne.mockResolvedValue(null);

    const result = await orgService.removeUser(orgId, userId);

    expect(result).toBeNull();
  });

  it("should return null if organization does not exist", async () => {
    const userId = "user-id";
    const orgId = "org-id";

    const mockUser = {
      id: userId,
      organizations: [{ id: orgId }],
    };

    userRepositoryMock.findOne.mockResolvedValue(mockUser);
    organizationRepositoryMock.findOne.mockResolvedValue(null);

    const result = await orgService.removeUser(orgId, userId);

    expect(result).toBeNull();
  });

  it("should return null if user is not part of the organization", async () => {
    const userId = "user-id";
    const orgId = "org-id";

    const mockUser = {
      id: userId,
      organizations: [{ id: "different-org-id" }],
    };
    const mockOrganization = {
      id: orgId,
      users: [{ id: "different-user-id" }],
    };

    userRepositoryMock.findOne.mockResolvedValue(mockUser);
    organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);

    const result = await orgService.removeUser(orgId, userId);

    expect(result).toBeNull();
  });
});
