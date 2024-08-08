import { Repository } from "typeorm";
import { NotificationsService } from "../services";
import { Notification } from "../models";
import { mock, MockProxy } from "jest-mock-extended";

describe("NotificationsService", () => {
  let notificationsService: NotificationsService;
  let notificationRepository: MockProxy<Repository<Notification>>;

  beforeEach(() => {
    notificationRepository = mock<Repository<Notification>>();
    notificationsService = new NotificationsService();
    (notificationsService as any).notificationRepository =
      notificationRepository;
  });

  describe("getNotificationsForUser", () => {
    it("should return the correct notification counts and list of notifications", async () => {
      const userId = "some-user-id";
      const mockNotifications = [
        { id: "1", isRead: false, createdAt: new Date(), user: { id: userId } },
        { id: "2", isRead: true, createdAt: new Date(), user: { id: userId } },
        { id: "3", isRead: false, createdAt: new Date(), user: { id: userId } },
      ] as any;

      notificationRepository.find.mockResolvedValue(mockNotifications);

      const result = await notificationsService.getNotificationsForUser(userId);

      expect(result.totalNotificationCount).toBe(3);
      expect(result.totalUnreadNotificationCount).toBe(2);
      expect(result.notifications).toEqual(mockNotifications);
    });

    it("should return empty counts and list if no notifications are found", async () => {
      const userId = "some-user-id";

      notificationRepository.find.mockResolvedValue([]);

      const result = await notificationsService.getNotificationsForUser(userId);

      expect(result.totalNotificationCount).toBe(0);
      expect(result.totalUnreadNotificationCount).toBe(0);
      expect(result.notifications).toEqual([]);
    });
  });
});
