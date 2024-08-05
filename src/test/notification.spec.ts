import { NotificationService } from "../services";
import { User, Notifications } from "../models";
import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { ResourceNotFound } from "../middleware";
import { INotification } from "../types";

jest.mock("../data-source", () => ({
  getRepository: jest.fn(),
}));

describe("Notification", () => {
  let notificationService: NotificationService;
  let notificationRepository: Repository<Notifications>;
  let userRepository: Repository<User>;

  beforeEach(() => {
    notificationRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    } as any;
    userRepository = {
      findOne: jest.fn(),
    } as any;
    (AppDataSource.getRepository as jest.Mock)
      .mockReturnValueOnce(userRepository)
      .mockReturnValueOnce(notificationRepository);
    notificationService = new NotificationService();
  });

  describe("Get User Notifications", () => {
    const userId = "user123";

    it("should return user notifications", async () => {
      const user = new User();
      const notifications = [new Notifications(), new Notifications()];
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (notificationRepository.find as jest.Mock).mockResolvedValue(
        notifications,
      );

      const result = await notificationService.getUserNotification(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(notificationRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
      expect(result).toEqual(notifications);
    });

    it("should throw ResourceNotFound if user not found", async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        notificationService.getUserNotification(userId),
      ).rejects.toThrow(ResourceNotFound);
    });
  });

  describe("Read All User Notifications", () => {
    const userId = "user123";

    it("should mark all user notifications as read", async () => {
      const user = new User();
      const notifications = [new Notifications(), new Notifications()];
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (notificationRepository.find as jest.Mock).mockResolvedValue(
        notifications,
      );
      (notificationRepository.save as jest.Mock).mockResolvedValue(
        notifications.map((notification) => {
          notification.is_read = true;
          return notification;
        }),
      );

      const result = await notificationService.readAllUserNotification(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(notificationRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
      expect(result.every((notification) => notification.is_read)).toBe(true);
    });

    it("should throw ResourceNotFound if no notifications found", async () => {
      const user = new User();
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (notificationRepository.find as jest.Mock).mockResolvedValue([]);

      await expect(
        notificationService.readAllUserNotification(userId),
      ).rejects.toThrow(ResourceNotFound);
    });
  });

  describe("All Unread Notifications", () => {
    const userId = "user123";

    it("should return all unread notifications", async () => {
      const user = new User();
      const notifications = [
        { ...new Notifications(), is_read: false },
        { ...new Notifications(), is_read: true },
      ];
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (notificationRepository.find as jest.Mock).mockResolvedValue(
        notifications,
      );

      const result = await notificationService.allUnreadNotification(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(notificationRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
      expect(result.length).toBe(1);
      expect(result[0].is_read).toBe(false);
    });

    it("should throw ResourceNotFound if no notifications found", async () => {
      const user = new User();
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (notificationRepository.find as jest.Mock).mockResolvedValue([]);

      await expect(
        notificationService.allUnreadNotification(userId),
      ).rejects.toThrow(ResourceNotFound);
    });
  });

  describe("Delete All User Notifications", () => {
    const userId = "user123";

    it("should delete all user notifications", async () => {
      const user = new User();
      const notifications = [new Notifications(), new Notifications()];
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (notificationRepository.find as jest.Mock).mockResolvedValue(
        notifications,
      );

      await notificationService.deleteAllUserNotification(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(notificationRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
      expect(notificationRepository.remove).toHaveBeenCalledWith(notifications);
    });

    it("should throw ResourceNotFound if no notifications found", async () => {
      const user = new User();
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (notificationRepository.find as jest.Mock).mockResolvedValue([]);

      await expect(
        notificationService.deleteAllUserNotification(userId),
      ).rejects.toThrow(ResourceNotFound);
    });
  });

  describe("Read or Unread User Notifications", () => {
    const notificationId = "notif123";
    const userId = "user123";
    const payload = { is_read: true };

    it("should mark notification as read or unread based on payload", async () => {
      const notification = new Notifications();
      (notificationRepository.findOne as jest.Mock).mockResolvedValue(
        notification,
      );
      (notificationRepository.save as jest.Mock).mockResolvedValue({
        ...notification,
        ...payload,
      });

      const result = await notificationService.isReadUserNotification(
        notificationId,
        userId,
        payload,
      );

      expect(notificationRepository.findOne).toHaveBeenCalledWith({
        where: { id: notificationId, user: { id: userId } },
      });
      expect(notificationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(payload),
      );
      expect(result).toEqual(expect.objectContaining(payload));
    });

    it("should throw ResourceNotFound if notification not found", async () => {
      (notificationRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        notificationService.isReadUserNotification(
          notificationId,
          userId,
          payload,
        ),
      ).rejects.toThrow(ResourceNotFound);
    });
  });

  describe("Create User Notification", () => {
    const userId = "user123";
    const payload: INotification = {
      message: "Test notification",
      is_read: false,
    };

    it("should create a new notification for an existing user", async () => {
      const user = new User();
      user.id = userId;
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);

      const savedNotification = { ...payload, id: "notif123" };
      (notificationRepository.save as jest.Mock).mockResolvedValue(
        savedNotification,
      );

      const result = await notificationService.createNotification(
        payload,
        userId,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(notificationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...payload,
        }),
      );
      expect(result).toEqual(savedNotification);
    });

    it("should throw ResourceNotFound if user doesn't exist", async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        notificationService.createNotification(payload, userId),
      ).rejects.toThrow(ResourceNotFound);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(notificationRepository.save).not.toHaveBeenCalled();
    });
  });
});
