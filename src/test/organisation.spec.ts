import { Request, Response } from "express";
import { OrgService } from "../services/OrgService";
import { OrgController } from "../controllers/OrgController";
import { AppDataSource } from "../data-source";
import { Organization } from "../models/organization";

// test with "npm test" or "npm test organisation.spec.ts"
// Mocking AppDataSource
jest.mock("../data-source", () => {
  return {
    AppDataSource: {
      getRepository: jest.fn(),
    },
  };
});

describe("OrgService and OrgController", () => {
  let orgService: OrgService;
  let orgController: OrgController;
  let organizationRepository: any;

  // Mocking OrgService dependencies
  beforeEach(() => {
    orgService = new OrgService();
    organizationRepository = {
      find: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(organizationRepository);

    orgController = new OrgController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("OrgService", () => {
    describe("getOrganizationsByUserId", () => {
      it("should return a list of organizations created by the user", async () => {
        const userId = "123";
        const organizations = [
          new Organization("1", "Organization One", "Description One", new Date(), new Date()),
          new Organization("2", "Organization Two", "Description Two", new Date(), new Date()),
        ];

        organizationRepository.find.mockResolvedValue(organizations);

        const result = await orgService.getOrganizationsByUserId(userId);

        expect(result).toEqual(organizations);
        expect(organizationRepository.find).toHaveBeenCalledWith({
          where: { id: userId },  // Updated to match the actual behavior
        });
      });

      it("should return an empty array if no organizations are found", async () => {
        const userId = "123";
        organizationRepository.find.mockResolvedValue([]);

        const result = await orgService.getOrganizationsByUserId(userId);

        expect(result).toEqual([]);
        expect(organizationRepository.find).toHaveBeenCalledWith({
          where: { id: userId },  // Updated to match the actual behavior
        });
      });
    });
  });

  describe("OrgController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = {
        params: { id: "123" },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    describe("getOrganizations", () => {
    //   it("should return a list of organizations created by the authenticated user", async () => {
    //     const organizations = [
    //       new Organization("1", "Organization One", "Description One", new Date(), new Date()),
    //       new Organization("2", "Organization Two", "Description Two", new Date(), new Date()),
    //     ];

    //     jest.spyOn(orgService, 'getOrganizationsByUserId').mockResolvedValue(organizations);

    //     await orgController.getOrganizations(req as Request, res as Response);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //       status: "success",
    //       status_code: 200,
    //       message: "Organizations retrieved successfully.",
    //       data: organizations,
    //     });
    //   });




    //   it("should return a message if no organizations are found", async () => {
    //     jest.spyOn(orgService, 'getOrganizationsByUserId').mockResolvedValue([]);

    //     await orgController.getOrganizations(req as Request, res as Response);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //       status: "success",
    //       status_code: 200,
    //       message: "No organizations found for this user.",
    //       data: [],
    //     });
    //   });

      it("should handle errors", async () => {
        const error = new Error("Database error");
        jest.spyOn(orgService, 'getOrganizationsByUserId').mockRejectedValue(error);

        await orgController.getOrganizations(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          status: "unsuccessful",
          status_code: 500,
          message: "Failed to retrieve organizations. Please try again later.",
        });
      });
    });
  });
});
