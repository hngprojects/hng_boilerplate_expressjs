// @ts-nocheck
import { Request } from "express";
import AppDataSource from "../data-source";
import { Organization } from "../models";
import { AdminOrganisationService } from "../services/admin.services";
import { HttpError } from "../middleware";

jest.mock("../data-source");
jest.mock("../models");
jest.mock("../utils");

describe("Organisation", () => {
  let adminOrganisationService: AdminOrganisationService;
  let consoleErrorMock: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  beforeEach(() => {
    adminOrganisationService = new AdminOrganisationService();
  });

  describe("Update Organisation", () => {
    it("should update the organosation successfully", async () => {
      const req = {
        body: {
          name: "org2",
          email: "org2@gmail.com",
          country: "nigeria",
          state: "nigeria",
        },
        params: { id: "1" },
      } as unknown as Request;

      const mockOrg = {
        id: "1",
        name: "Org1",
        email: "org1@gmail.com",
        country: "nigeria",
        state: "nigeria",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Organization;

      const updatedOrg = {
        name: "org2",
        email: "org2@gmail.com",
        country: "nigeria",
        state: "nigeria",
      };

      const mockUpdatedOrg = {
        ...mockOrg,
        ...updatedOrg,
        updatedAt: new Date(),
      };

      const orgRepository = {
        findOne: jest.fn().mockResolvedValue(mockOrg),
        update: jest.fn().mockImplementation((id, fields) => {
          Object.assign(mockOrg, fields);
          return Promise.resolve();
        }),
        findOneBy: jest.fn().mockResolvedValue(mockUpdatedOrg),
      };

      (AppDataSource.getRepository as jest.Mock).mockReturnValue(orgRepository);
      const result = await adminOrganisationService.update(req);

      expect(orgRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(orgRepository.update).toHaveBeenCalledWith("1", {
        name: "org2",
        email: "org2@gmail.com",
        country: "nigeria",
        state: "nigeria",
      });
      expect(result).toEqual(mockUpdatedOrg);
    });

    it("should throw a 404 error if organisation is not found", async () => {
      const req = {
        body: {
          // id: "2",
          name: "Org3",
          email: "org3@gmail.com",
          country: "nigeria",
          state: "nigeria",
        },
        params: { id: "2" },
      } as unknown as Request;

      const orgRepository = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      (AppDataSource.getRepository as jest.Mock).mockReturnValue(orgRepository);

      await expect(adminOrganisationService.update(req)).rejects.toThrow(
        HttpError,
      );
      await expect(adminOrganisationService.update(req)).rejects.toThrow(
        "Not Found",
      );
      expect(orgRepository.findOne).toHaveBeenCalledWith({
        where: { id: "2" },
      });
    });
  });
});
