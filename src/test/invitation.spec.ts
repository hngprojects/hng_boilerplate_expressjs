import { OrgService } from "../services";
import { Repository } from "typeorm";
import { Invitation, Organization, User, UserOrganization } from "../models";
import AppDataSource from "../data-source";
import { ResourceNotFound, Conflict } from "../middleware";
import { addEmailToQueue } from "../utils/queue";
import config from "../config";

jest.mock("../data-source");
jest.mock("../utils/queue");
jest.mock("../views/email/renderTemplate");
jest.mock("uuid", () => ({ v4: jest.fn(() => "some-uuid-token") }));

const frontendBaseUrl = config.BASE_URL;

describe("InviteService", () => {
  let inviteService: OrgService;
  let inviteRepository: jest.Mocked<Repository<Invitation>>;
  let organizationRepository: jest.Mocked<Repository<Organization>>;
  let userOrganizationRepository: jest.Mocked<Repository<UserOrganization>>;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    inviteRepository = {
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any;
    organizationRepository = {
      findOne: jest.fn(),
    } as any;
    userOrganizationRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any;
    userRepository = {
      findOne: jest.fn(),
    } as any;

    AppDataSource.getRepository = jest.fn().mockImplementation((model) => {
      switch (model) {
        case Invitation:
          return inviteRepository;
        case Organization:
          return organizationRepository;
        case UserOrganization:
          return userOrganizationRepository;
        case User:
          return userRepository;
      }
    });

    inviteService = new OrgService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateGenericInviteLink", () => {
    it("should generate a generic invite link", async () => {
      const organizationId = "org-123";
      const organization = { id: organizationId } as Organization;

      organizationRepository.findOne.mockResolvedValue(organization);
      inviteRepository.create.mockReturnValue({
        token: "some-uuid-token",
        isGeneric: true,
        organization,
      } as Invitation);

      const result =
        await inviteService.generateGenericInviteLink(organizationId);

      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: organizationId },
      });
      expect(inviteRepository.create).toHaveBeenCalledWith({
        token: "some-uuid-token",
        isGeneric: true,
        organization: { id: organizationId },
      });
      expect(inviteRepository.save).toHaveBeenCalledWith({
        token: "some-uuid-token",
        isGeneric: true,
        organization,
      });
      expect(result).toBe(`${frontendBaseUrl}/invite?token=some-uuid-token`);
    });

    it("should throw ResourceNotFound if organization does not exist", async () => {
      const organizationId = "org-123";

      organizationRepository.findOne.mockResolvedValue(null);

      await expect(
        inviteService.generateGenericInviteLink(organizationId),
      ).rejects.toThrow(ResourceNotFound);
    });
  });

  describe("generateAndSendInviteLinks", () => {
    it("should generate and send invite links", async () => {
      const organizationId = "org-123";
      const emails = ["test1@example.com", "test2@example.com"];
      const organization = {
        id: organizationId,
        name: "Test Organization",
      } as Organization;

      organizationRepository.findOne.mockResolvedValue(organization);
      inviteRepository.create.mockImplementation(
        (invite) =>
          ({
            ...invite,
            token: "some-uuid-token",
            email: invite.email,
            isGeneric: false,
            organization: invite.organization,
          }) as Invitation,
      );
      inviteRepository.save.mockResolvedValue([
        {
          token: "some-uuid-token",
          email: emails[0],
          isGeneric: false,
          organization,
          id: "invite-id",
          isAccepted: false,
        },
        {
          token: "some-uuid-token-2",
          email: emails[1],
          isGeneric: false,
          organization,
          id: "invite-id-2",
          isAccepted: false,
        },
      ] as unknown as Invitation);
      await inviteService.generateAndSendInviteLinks(emails, organizationId);

      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: organizationId },
      });
      expect(inviteRepository.save).toHaveBeenCalledWith(expect.any(Array));
      expect(addEmailToQueue).toHaveBeenCalledTimes(emails.length);
    });

    it("should throw ResourceNotFound if organization does not exist", async () => {
      const organizationId = "org-123";
      const emails = ["test1@example.com", "test2@example.com"];

      organizationRepository.findOne.mockResolvedValue(null);

      await expect(
        inviteService.generateAndSendInviteLinks(emails, organizationId),
      ).rejects.toThrow(ResourceNotFound);
    });
  });

  describe("getAllInvite", () => {
    it("should return paginated invites", async () => {
      const mockInvites: Invitation[] = [
        {
          id: "1",
          token: "token1",
          email: "email1@example.com",
          isGeneric: false,
          isAccepted: false,
          organization: new Organization(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "2",
          token: "token2",
          email: "email2@example.com",
          isGeneric: false,
          isAccepted: false,
          organization: new Organization(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      const mockTotal = 2;

      inviteRepository.findAndCount.mockResolvedValue([mockInvites, mockTotal]);

      const page = 1;
      const pageSize = 2;

      const result = await inviteService.getAllInvite(page, pageSize);

      expect(inviteRepository.findAndCount).toHaveBeenCalledWith({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      expect(result).toEqual({
        status_code: 200,
        message: "Successfully fetched invites",
        data: mockInvites.map((invite) => ({
          id: invite.id,
          token: invite.token,
          isAccepted: invite.isAccepted,
          isGeneric: invite.isGeneric,
          organization: invite.organization,
          email: invite.email,
        })),
        total: mockTotal,
      });
    });

    it("should return no invites when none exist", async () => {
      const mockInvites: Invitation[] = [];
      const mockTotal = 0;

      inviteRepository.findAndCount.mockResolvedValue([mockInvites, mockTotal]);

      const page = 1;
      const pageSize = 2;

      const result = await inviteService.getAllInvite(page, pageSize);

      expect(inviteRepository.findAndCount).toHaveBeenCalledWith({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      expect(result).toEqual({
        status_code: 200,
        message: "No invites yet",
        data: mockInvites,
        total: mockTotal,
      });
    });
  });
});
