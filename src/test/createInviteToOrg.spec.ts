import { OrgService } from "../services/org.services";
import { User } from "../models/user";
import { Organization } from "../models/organization";
import { Invitation } from "../models";
import AppDataSource from "../data-source";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "../enums/userRoles";
jest.mock("../data-source");
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

describe("OrgService - createInvitation", () => {
  let orgService: OrgService;
  let invitationRepositoryMock: any;
  let organizationRepositoryMock: any;
  let userRepositoryMock: any;

  beforeEach(() => {
    orgService = new OrgService();

    invitationRepositoryMock = {
      save: jest.fn(),
    };
    organizationRepositoryMock = {
      findOne: jest.fn(),
    };
    userRepositoryMock = {
      findOne: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation((model) => {
      if (model === Invitation) {
        return invitationRepositoryMock;
      }
      if (model === Organization) {
        return organizationRepositoryMock;
      }
      if (model === User) {
        return userRepositoryMock;
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // it("should create an invitation successfully", async () => {
  //   const mockOrganization = { id: "org-id" } as Organization;
  //   const mockInviter = { id: "inviter-id", role: UserRole.ADMIN } as User;
  //   const mockEmail = "invitee@example.com";

  //   organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);
  //   userRepositoryMock.findOne.mockResolvedValue(mockInviter);

  //   await orgService.createInvitation("org-id", mockEmail, "inviter-id");

  //   expect(invitationRepositoryMock.save).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       token: "mocked-uuid",
  //       organization: mockOrganization,
  //       user: mockInviter,
  //       email: mockEmail,
  //     }),
  //   );
  // });

  it("should throw an error if organization is not found", async () => {
    organizationRepositoryMock.findOne.mockResolvedValue(null);

    await expect(
      orgService.createInvitation(
        "org-id",
        "invitee@example.com",
        "inviter-id",
      ),
    ).rejects.toThrow("Organization not found.");
  });

  it("should throw an error if inviter is not found", async () => {
    const mockOrganization = { id: "org-id" } as Organization;
    organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);
    userRepositoryMock.findOne.mockResolvedValue(null);

    await expect(
      orgService.createInvitation(
        "org-id",
        "invitee@example.com",
        "inviter-id",
      ),
    ).rejects.toThrow("Inviter not found.");
  });

  it("should throw an error if inviter does not have permission", async () => {
    const mockOrganization = { id: "org-id" } as Organization;
    const mockInviter = { id: "inviter-id", role: UserRole.USER } as User;

    organizationRepositoryMock.findOne.mockResolvedValue(mockOrganization);
    userRepositoryMock.findOne.mockResolvedValue(mockInviter);

    await expect(
      orgService.createInvitation(
        "org-id",
        "invitee@example.com",
        "inviter-id",
      ),
    ).rejects.toThrow("Permission denied.");
  });
});
