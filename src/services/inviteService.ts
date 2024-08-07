import { Repository } from "typeorm";
import { Invitation, Organization, User, UserOrganization } from "../models";
import AppDataSource from "../data-source";
import { v4 as uuidv4 } from "uuid";
import { ResourceNotFound, Conflict } from "../middleware";
import config from "../config";
import { addEmailToQueue } from "../utils/queue";
import renderTemplate from "../views/email/renderTemplate";
const frontendBaseUrl = config.BASE_URL;
export class InviteService {
  private inviteRepository: Repository<Invitation>;
  private organizationRepository: Repository<Organization>;
  private userOrganizationRepository: Repository<UserOrganization>;
  private userRepository: Repository<User>;
  constructor() {
    this.inviteRepository = AppDataSource.getRepository(Invitation);
    this.organizationRepository = AppDataSource.getRepository(Organization);
    this.userOrganizationRepository =
      AppDataSource.getRepository(UserOrganization);
    this.userRepository = AppDataSource.getRepository(User);
  }

  public async generateGenericInviteLink(
    organizationId: string,
  ): Promise<string> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new ResourceNotFound(
        `Organization with ID ${organizationId} not found`,
      );
    }
    const token = uuidv4();
    const invite = this.inviteRepository.create({
      token,
      isGeneric: true,
      organization: { id: organizationId },
    });

    await this.inviteRepository.save(invite);

    return `${frontendBaseUrl}/invite?token=${token}`;
  }
}
