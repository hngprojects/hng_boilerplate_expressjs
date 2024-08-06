import { NotificationSettingService } from "../services";
import { NotificationSettings, User } from "../models";
import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Conflict } from "../middleware";

jest.mock("../data-source", () => ({
  getRepository: jest.fn(),
}));

describe("Notification Setting", () => {
  let notificationSettingService: NotificationSettingService;
  let notificationRepository: Repository<NotificationSettings>;
  let userRepository: Repository<User>;

  beforeEach(() => {
    notificationRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any;
    userRepository = {} as any;
    (AppDataSource.getRepository as jest.Mock)
      .mockReturnValueOnce(userRepository)
      .mockReturnValueOnce(notificationRepository);
    notificationSettingService = new NotificationSettingService();
  });

  describe("Update Notification Settings", () => {
    const userId = "user123";
    const auth_userId = "user123";
    const payload = {
      mobile_notifications: true,
      email_notifications_activity_workspace: false,
    };

    it("should update existing notification settings", async () => {
      const existingSettings = new NotificationSettings();
      (notificationRepository.findOne as jest.Mock).mockResolvedValue(
        existingSettings,
      );
      (notificationRepository.save as jest.Mock).mockResolvedValue({
        ...existingSettings,
        ...payload,
      });

      const result = await notificationSettingService.updateNotificationSetting(
        payload,
        userId,
        auth_userId,
      );

      expect(notificationRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
      expect(notificationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(payload),
      );
      expect(result).toEqual(expect.objectContaining(payload));
    });

    it("should create new notification settings if not found", async () => {
      (notificationRepository.findOne as jest.Mock).mockResolvedValue(null);
      (notificationRepository.create as jest.Mock).mockReturnValue(payload);
      (notificationRepository.save as jest.Mock).mockResolvedValue(payload);

      const result = await notificationSettingService.updateNotificationSetting(
        payload,
        userId,
        auth_userId,
      );

      expect(notificationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(payload),
      );
      expect(notificationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(payload),
      );
      expect(result).toEqual(expect.objectContaining(payload));
    });

    it("should throw Conflict error if userId doesn't match auth_userId", async () => {
      await expect(
        notificationSettingService.updateNotificationSetting(
          payload,
          userId,
          "differentUser",
        ),
      ).rejects.toThrow(Conflict);
    });
  });
});
