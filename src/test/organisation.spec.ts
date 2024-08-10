// @ts-nocheck
import jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import { OrgController } from "../controllers";
import AppDataSource from "../data-source";
import { authMiddleware } from "../middleware/auth";
import {
  InvalidInput,
  ResourceNotFound,
  ServerError,
} from "../middleware/error";
import { validateOrgId } from "../middleware/organizationValidation";
import { Organization, OrganizationRole, User } from "../models";
import { OrgService } from "../services";
import isSuperAdmin from "../utils/isSuperAdmin";

jest.mock("../data-source", () => ({
  __esModule: true,
  default: {
    getRepository: jest.fn(),
    initialize: jest.fn(),
    isInitialized: false,
  },
}));
jest.mock("jsonwebtoken");
jest.mock("passport", () => ({
  use: jest.fn(),
}));
jest.mock("passport-google-oauth2", () => ({
  Strategy: jest.fn(),
}));

jest.mock("../utils/isSuperAdmin");

describe("Organization Controller and Middleware", () => {
  let organizationService: OrgService;
  let orgController: OrgController;
  let mockManager;
  let organizationRepositoryMock: jest.Mocked<Repository<Organization>>;
  let organizationRoleRepositoryMock: jest.Mocked<Repository<OrganizationRole>>;

  beforeEach(() => {
    jest.clearAllMocks();
    orgController = new OrgController();

    organizationRepositoryMock = {
      findOne: jest.fn(),
    } as any;
    organizationRoleRepositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as any;
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Organization) return organizationRepositoryMock;
      if (entity === OrganizationRole) return organizationRoleRepositoryMock;
      return {};
    });

    organizationService = new OrgService();
  });

  describe("getOrganization", () => {
    it("check if user is authenticated", async () => {
      const req = {
        headers: {
          authorization: "Bearer validToken",
        },
        user: undefined,
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next = jest.fn();

      jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
        callback(null, { userId: "user123" });
      });

      User.findOne = jest.fn().mockResolvedValue({
        id: "donalTrump123",
        email: "americaPresident@newyork.com",
      });

      await authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe("donalTrump123");
      expect(next).toHaveBeenCalled();
    });

    it("should get a single user org", async () => {
      const orgId = "1";
      const orgRes = {
        org_id: "1",
        name: "Org 1",
        description: "Org 1 description",
      };

      organizationRepositoryMock.findOne.mockResolvedValue(orgRes);
    });

    it("should pass valid UUID for org_id", async () => {
      const req = {
        params: { org_id: "123e4567-e89b-12d3-a456-426614174000" },
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn();

      await validateOrgId[0](req, res, next);
      await validateOrgId[1](req, res, next);

      expect(next).toHaveBeenCalledTimes(2);
      expect(next).toHaveBeenCalledWith();
    });

    it("should throw InvalidInput for empty org_id", async () => {
      const req = {
        params: { org_id: "" },
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn();

      await validateOrgId[0](req, res, next);

      expect(() => validateOrgId[1](req, res, next)).toThrow(InvalidInput);
      expect(() => validateOrgId[1](req, res, next)).toThrow(
        "Organisation id is required",
      );
    });

    it("should throw InvalidInput for non-UUID org_id", async () => {
      const req = {
        params: { org_id: "donald-trump-for-president" },
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn();

      await validateOrgId[0](req, res, next);

      expect(() => validateOrgId[1](req, res, next)).toThrow(InvalidInput);
      expect(() => validateOrgId[1](req, res, next)).toThrow(
        "Valid org_id must be provided",
      );
    });
  });

  describe("fetchAllRolesInOrganization", () => {
    it("should fetch all roles for an existing organization", async () => {
      const organizationId = "org123";
      const mockOrganization = { id: organizationId, name: "Test Org" };
      const mockRoles = [
        { id: "role1", name: "Admin", description: "Administrator" },
        { id: "role2", name: "User", description: "Regular User" },
      ];

      organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);
      organizationRoleRepositoryMock.find.mockResolvedValue(mockRoles);

      const result =
        await organizationService.fetchAllRolesInOrganization(organizationId);

      expect(result).toEqual(mockRoles);
      expect(organizationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: organizationId },
      });
      expect(organizationRoleRepositoryMock.find).toHaveBeenCalledWith({
        where: { organization: { id: organizationId } },
        select: ["id", "name", "description"],
      });
    });

    it("should throw ResourceNotFound for non-existent organization", async () => {
      const organizationId = "nonexistent123";

      organizationRepositoryMock.findOne.mockResolvedValue(null);

      await expect(
        organizationService.fetchAllRolesInOrganization(organizationId),
      ).rejects.toThrow(ResourceNotFound);

      expect(organizationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: organizationId },
      });
      expect(organizationRoleRepositoryMock.find).not.toHaveBeenCalled();
    });

    it("should return an empty array when organization has no roles", async () => {
      const organizationId = "org456";
      const mockOrganization = { id: organizationId, name: "Test Org" };

      organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);
      organizationRoleRepositoryMock.find.mockResolvedValue([]);

      const result =
        await organizationService.fetchAllRolesInOrganization(organizationId);

      expect(result).toEqual([]);
      expect(organizationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: organizationId },
      });
      expect(organizationRoleRepositoryMock.find).toHaveBeenCalledWith({
        where: { organization: { id: organizationId } },
        select: ["id", "name", "description"],
      });
    });
  });

  describe("fetchSingleRoleInOrganisation", () => {
    it("should fetch a single role", async () => {
      const organisationId = "org123";
      const roleId = "role456";
      const mockOrganization: Organization = {
        id: organisationId,
        name: "Test Org",
      };
      const mockRole: OrganizationRole = {
        id: roleId,
        name: "Administrator",
        description: "Administrator",
        permissions: [],
        organization: mockOrganization,
      };

      organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);
      organizationRoleRepositoryMock.findOne.mockResolvedValue(mockRole);

      const result = await organizationService.fetchSingleRole(
        organisationId,
        roleId,
      );

      expect(result).toEqual(mockRole);
      expect(organizationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: organisationId },
      });
      expect(organizationRoleRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: roleId, organization: { id: organisationId } },
        relations: ["permissions"],
      });
    });

    it("should throw ResourceNotFound if the organization does not exist", async () => {
      const organisationId = "nonexistent123";
      const roleId = "role456";

      organizationRepositoryMock.findOne.mockResolvedValue(null);

      await expect(
        organizationService.fetchSingleRole(organisationId, roleId),
      ).rejects.toThrow(ResourceNotFound);

      expect(organizationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: organisationId },
      });
      expect(organizationRoleRepositoryMock.findOne).not.toHaveBeenCalled();
    });

    it("should throw ServerError for unexpected errors", async () => {
      const organisationId = "org123";
      const roleId = "role456";
      const mockError = new ServerError("Database error");

      organizationRepositoryMock.findOne.mockRejectedValue(mockError);

      await expect(
        organizationService.fetchSingleRole(organisationId, roleId),
      ).rejects.toThrow(ServerError);

      expect(organizationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: organisationId },
      });
      expect(organizationRoleRepositoryMock.findOne).not.toHaveBeenCalled();
    });
  });
});

describe("Update User Organization", () => {
  let orgService: OrgService;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };
    AppDataSource.getRepository.mockReturnValue(mockRepository);
    orgService = new OrgService();
  });

  it("should successfully update organization details", async () => {
    const mockOrgId = "123e4567-e89b-12d3-a456-426614174000";
    const userId = "user123";
    const updateData = {
      name: "New Organization Name",
      email: "newemail@example.com",
      industry: "Tech",
      type: "Private",
      country: "NGA",
      address: "1234 New HNG",
      state: "Lagos",
      description: "A new description of the organization.",
    };

    const mockOrg = {
      id: mockOrgId,
      ...updateData,
    };

    mockRepository.findOne.mockResolvedValue(mockOrg);
    mockRepository.update.mockResolvedValue(mockOrg);

    const result = await orgService.updateOrganizationDetails(
      mockOrgId,
      userId,
      updateData,
    );

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockOrgId, userOrganizations: { user: { id: userId } } },
    });

    expect(mockRepository.update).toHaveBeenCalledWith(mockOrgId, updateData);
    expect(result).toEqual(mockOrg);
  });

  it("should throw ResourceNotFound if organization does not exist", async () => {
    const mockOrgId = "123e4567-e89b-12d3-a456-426614174000";
    const userId = "user123";
    const updateData = {
      name: "New Organization Name",
      email: "newemail@example.com",
      industry: "Tech",
      type: "Private",
      country: "NGA",
      address: "1234 New HNG",
      state: "Lagos",
      description: "A new description of the organization.",
    };

    mockRepository.findOne.mockResolvedValue(null);

    await expect(
      orgService.updateOrganizationDetails(mockOrgId, userId, updateData),
    ).rejects.toThrow(ResourceNotFound);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockOrgId, userOrganizations: { user: { id: userId } } },
    });

    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  describe("OrganizationController - getAllOrgProducts", () => {
    let orgController: OrgController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let orgServiceMock: jest.Mocked<OrgService>;

    beforeEach(() => {
      jest.clearAllMocks();

      orgServiceMock = {
        getAllOrgProducts: jest.fn(),
      } as any;

      orgController = new OrgController();
      mockRequest = {
        params: { org_id: "mock-org-id" },
        user: { id: "mock-user-id" },
      };
      mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      mockNext = jest.fn();
    });

    it("should return 401 if user is not authenticated", async () => {
      mockRequest.user = null; // Simulate unauthenticated user

      await orgController.getAllOrgProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status_code: 401,
        success: false,
        message: "User not authenticated",
      });
    });

    it("should return 403 if user is not authorized", async () => {
      jest.mocked(isSuperAdmin).mockResolvedValue(false); // Simulate user is not a super admin

      await orgController.getAllOrgProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status_code: 403,
        success: false,
        message: "User is not authorized to fetch all products",
      });
    });

    it("should return 500 if an error occurs", async () => {
      jest.mocked(isSuperAdmin).mockResolvedValue(true);
      orgServiceMock.getAllOrgProducts.mockRejectedValue(
        new Error("Database error"),
      );

      await orgController.getAllOrgProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status_code: 500,
        message: "Unable to retrieve products. Please try again later.",
      });
    });
  });
});
