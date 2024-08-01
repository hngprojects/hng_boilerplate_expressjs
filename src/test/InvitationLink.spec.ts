import { Request, Response, NextFunction } from "express";
import { OrgService } from "../services/org.services";
import { OrgController } from "../controllers";
import {
  Organization,
  OrgInviteToken,
  Invitation,
  User,
  UserOrganization,
} from "../models";
import AppDataSource from "../data-source";
import { v4 as uuidv4 } from "uuid";
import { ResourceNotFound, Conflict } from "../middleware/error";
import { UserRole } from "../enums/userRoles";

jest.mock("../data-source");
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

const mockRepositories = () => {
  const organisationRepositoryMock = { findOne: jest.fn() };
  const orgInviteTokenRepositoryMock = { save: jest.fn(), findOne: jest.fn() };
  const invitationRepositoryMock = { findOne: jest.fn(), save: jest.fn() };
  const userRepositoryMock = { findOneBy: jest.fn() };
  const userOrganizationRepositoryMock = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  (AppDataSource.getRepository as jest.Mock).mockImplementation((model) => {
    if (model === Organization) return organisationRepositoryMock;
    if (model === OrgInviteToken) return orgInviteTokenRepositoryMock;
    if (model === Invitation) return invitationRepositoryMock;
    if (model === User) return userRepositoryMock;
    if (model === UserOrganization) return userOrganizationRepositoryMock;
  });

  return {
    organisationRepositoryMock,
    orgInviteTokenRepositoryMock,
    invitationRepositoryMock,
    userRepositoryMock,
    userOrganizationRepositoryMock,
  };
};

const mockReqResNext = () => {
  const req: Partial<Request> = {
    params: { org_id: "org-id" },
    body: { email: ["test1@example.com", "test2@example.com"] },
    query: { token: "invite-token" },
    user: { id: "user-id" } as User,
  };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: NextFunction = jest.fn();
  return { req, res, next };
};

describe("OrgController", () => {
  let orgService: OrgService;
  let orgController: OrgController;
  let req: Partial<Request> | any;
  let res: Partial<Response>;
  let next: NextFunction;
  let repositories: ReturnType<typeof mockRepositories>;

  beforeEach(() => {
    repositories = mockRepositories();
    orgService = new OrgService();
    orgController = new OrgController();
    ({ req, res, next } = mockReqResNext());
    (uuidv4 as jest.Mock).mockReturnValue("generated-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateInviteLink", () => {
    it("should generate an invite link", async () => {
      const { organisationRepositoryMock, orgInviteTokenRepositoryMock } =
        repositories;
      const mockOrganization = { id: "org-id" } as Organization;
      organisationRepositoryMock.findOne.mockResolvedValue(mockOrganization);

      await orgController.generateInviteLink(req, res as Response, next);

      expect(organisationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: "org-id" },
      });
      expect(orgInviteTokenRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "generated-token",
          organization: mockOrganization,
        }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        status_code: 200,
        invite_token: "generated-token",
      });
    });

    it("should handle organization not found", async () => {
      const { organisationRepositoryMock } = repositories;
      organisationRepositoryMock.findOne.mockResolvedValue(null);

      await orgController.generateInviteLink(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ResourceNotFound));
    });
  });

  describe("sendInviteLinks", () => {
    it("should send invite links", async () => {
      const {
        organisationRepositoryMock,
        orgInviteTokenRepositoryMock,
        invitationRepositoryMock,
      } = repositories;
      const mockOrganization = { id: "org-id" } as Organization;
      organisationRepositoryMock.findOne.mockResolvedValue(mockOrganization);

      await orgController.sendInviteLinks(req, res as Response, next);

      expect(organisationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: "org-id" },
      });
      expect(orgInviteTokenRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(invitationRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        status_code: 200,
        message: "Invitations successfully sent.",
      });
    });

    it("should handle organization not found", async () => {
      const { organisationRepositoryMock } = repositories;
      organisationRepositoryMock.findOne.mockResolvedValue(null);

      await orgController.sendInviteLinks(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(ResourceNotFound));
    });

    it("should handle missing emails", async () => {
      req.body.email = undefined;

      await orgController.sendInviteLinks(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        status: "Unsuccessful",
        status_code: 422,
        message: "Emails are required!",
      });
    });
  });

  describe("acceptInvite", () => {
    it("should add user to organization using invitation", async () => {
      const {
        userRepositoryMock,
        invitationRepositoryMock,
        userOrganizationRepositoryMock,
      } = repositories;
      const mockUser = { id: "user-id", email: "user@example.com" } as User;
      const mockOrganization = {
        id: "org-id",
        name: "OrgName",
      } as Organization;
      const mockInvitation = {
        token: "invite-token",
        organization: mockOrganization,
        email: "user@example.com",
      } as Invitation;

      userRepositoryMock.findOneBy.mockResolvedValue(mockUser);
      invitationRepositoryMock.findOne.mockResolvedValue(mockInvitation);
      userOrganizationRepositoryMock.findOne.mockResolvedValue(null);

      await orgController.acceptInvite(req, res as Response, next);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: "user-id",
      });
      expect(invitationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { token: "invite-token", email: "user@example.com" },
        relations: ["organization"],
      });
      expect(userOrganizationRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          user: mockUser,
          organization: mockOrganization,
          role: UserRole.USER,
        }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        status_code: 200,
        message: "You have been added to the organization.",
      });
    });

    it("should handle invalid invite token", async () => {
      const { userRepositoryMock } = repositories;
      userRepositoryMock.findOneBy.mockResolvedValue(null);

      await orgController.acceptInvite(req, res as Response, next);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: "user-id",
      });
      expect(next).toHaveBeenCalledWith(expect.any(ResourceNotFound));
    });

    it("should handle user already a member", async () => {
      const {
        userRepositoryMock,
        invitationRepositoryMock,
        orgInviteTokenRepositoryMock,
        userOrganizationRepositoryMock,
      } = repositories;
      const mockUser = { id: "user-id", email: "user@example.com" } as User;
      const mockOrganization = { id: "org-id" } as Organization;
      const mockExistingUserOrg = {
        user: mockUser,
        organization: mockOrganization,
      } as UserOrganization;

      userRepositoryMock.findOneBy.mockResolvedValue(mockUser);
      invitationRepositoryMock.findOne.mockResolvedValue(null);
      orgInviteTokenRepositoryMock.findOne.mockResolvedValue({
        token: "invite-token",
        organization: mockOrganization,
      });
      userOrganizationRepositoryMock.findOne.mockResolvedValue(
        mockExistingUserOrg,
      );

      await orgController.acceptInvite(req, res as Response, next);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: "user-id",
      });
      expect(orgInviteTokenRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { token: "invite-token" },
        relations: ["organization"],
      });
      expect(next).toHaveBeenCalledWith(expect.any(Conflict));
    });

    it("should handle missing invite token", async () => {
      req.query.token = undefined;

      await orgController.acceptInvite(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        status: "Unsuccessful",
        status_code: 422,
        message: "Invite token is required!",
      });
    });
  });
});
