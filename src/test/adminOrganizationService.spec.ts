// src/services/AdminOrganisationService.spec.ts
import AppDataSource from "../data-source";
import { Organization } from "../models";
import { HttpError } from "../middleware";
import { AdminOrganisationService } from "../services/admin.services";
import { validate as uuidValidate } from "uuid";

jest.mock("../data-source", () => {
  return {
    AppDataSource: {
      getRepository: jest.fn(),
    },
  };
});

jest.mock("../models");
jest.mock("uuid", () => ({
  validate: jest.fn(),
}));

describe("AdminOrganisationService - getById", () => {
  let adminOrganisationService: AdminOrganisationService;
  let mockRepository;

  beforeEach(() => {
    adminOrganisationService = new AdminOrganisationService();
    mockRepository = {
      findOne: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  it("should return the organization if it exists", async () => {
    const org_id = "valid-uuid";
    const mockOrganization = { id: org_id, name: "Org" };

    (uuidValidate as jest.Mock).mockReturnValue(true);
    mockRepository.findOne.mockResolvedValue(mockOrganization);

    const result = await adminOrganisationService.getSingleOrgById({ params: { id: org_id } } as any);

    expect(result).toEqual(mockOrganization);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: org_id } });
  });

  it("should throw a 400 error for an invalid UUID", async () => {
    const org_id = "invalid-uuid";

    (uuidValidate as jest.Mock).mockReturnValue(false);

    await expect(adminOrganisationService.getSingleOrgById({ params: { id: org_id } } as any))
      .rejects.toThrow(new HttpError(400, "Invalid organization ID."));
  });

  it("should throw a 404 error if the organization is not found", async () => {
    const org_id = "valid-uuid";

    (uuidValidate as jest.Mock).mockReturnValue(true);
    mockRepository.findOne.mockResolvedValue(null);

    await expect(adminOrganisationService.getSingleOrgById({ params: { id: org_id } } as any))
      .rejects.toThrow(new HttpError(404, "Organization not found."));
  });
});
