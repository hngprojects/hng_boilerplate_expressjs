import { Request, Response } from "express";
import { OrgService } from "../services/org.services";
import { User } from "../models/user";
import { Organization } from "../models/organization";
import { Invitation } from "../models/invitation";
import { UserOrganization } from "../models/user-organisation";
import AppDataSource from "../data-source";

jest.mock("../data-source");

describe("OrgService", () => {
  let orgService: OrgService;
  let invitationRepositoryMock: any;
  let userRepositoryMock: any;
  let organizationRepositoryMock: any;
  let userOrganizationRepositoryMock: any;
  let req: Partial<Request> | any;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    orgService = new OrgService();

    invitationRepositoryMock = {
      findOne: jest.fn(),
      remove: jest.fn(),
    };
    userRepositoryMock = {
      findOneBy: jest.fn(),
    };
    organizationRepositoryMock = {
      findOne: jest.fn(),
    };
    userOrganizationRepositoryMock = {
      save: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation((model) => {
      if (model === Invitation) {
        return invitationRepositoryMock;
      }
      if (model === User) {
        return userRepositoryMock;
      }
      if (model === Organization) {
        return organizationRepositoryMock;
      }
      if (model === UserOrganization) {
        return userOrganizationRepositoryMock;
      }
    });

    req = {
      body: {
        inviteToken: "valid-token",
      },
      user: {
        id: "user-id",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add user to organization and remove invitation", async () => {
    const mockInvitation = {
      token: "valid-token",
      expires_at: new Date(Date.now() + 100000),
      organization: { id: "org-id" } as Organization,
    } as Invitation;
    const mockUser = { id: "user-id" } as User;
    const mockOrganization = {
      id: "org-id",
      userOrganizations: [],
    } as unknown as Organization;

    invitationRepositoryMock.findOne.mockResolvedValue(mockInvitation);
    userRepositoryMock.findOneBy.mockResolvedValue(mockUser);
    organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);

    await orgService.joinOrganizationByInvite(
      mockInvitation.token,
      mockUser.id,
    );

    expect(userOrganizationRepositoryMock.save).toHaveBeenCalled();
    expect(invitationRepositoryMock.remove).toHaveBeenCalledWith(
      mockInvitation,
    );
  });

  it("should throw error if invitation is invalid or expired", async () => {
    const mockInvitation = {
      token: "expired-token",
      expires_at: new Date(Date.now() - 100000),
    } as Invitation;

    invitationRepositoryMock.findOne.mockResolvedValue(mockInvitation);

    await expect(
      orgService.joinOrganizationByInvite("expired-token", "user-id"),
    ).rejects.toThrow("Invalid or expired invitation.");
  });

  it("should throw error if user is already a member of the organization", async () => {
    const mockInvitation = {
      token: "valid-token",
      expires_at: new Date(Date.now() + 100000),
      organization: { id: "org-id" } as Organization,
    } as Invitation;
    const mockUser = { id: "user-id" } as User;
    const mockOrganization = {
      id: "org-id",
      userOrganizations: [
        { userId: "user-id", organizationId: "org-id" } as UserOrganization,
      ],
    } as unknown as Organization;

    invitationRepositoryMock.findOne.mockResolvedValue(mockInvitation);
    userRepositoryMock.findOneBy.mockResolvedValue(mockUser);
    organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);

    await expect(
      orgService.joinOrganizationByInvite("valid-token", "user-id"),
    ).rejects.toThrow("User is already a member of the organization.");
  });
});
