import { Request, Response, NextFunction } from "express";
import { ContactController } from "../controllers";
import { ContactService } from "../services";

jest.mock("../services/contactService");

describe("ContactController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createContact", () => {
    it("should successfully create a contact", async () => {
      const contactData = {
        name: "John Doe",
        email: "johndoe@example.com",
        phone_number: "1234567890",
        message: "I would like to inquire about your services.",
      };
      const contact = { id: 1, ...contactData };

      (ContactService.prototype.createContact as jest.Mock).mockResolvedValue(
        contact,
      );

      req.body = contactData;

      await new ContactController().createContact(
        req as Request,
        res as Response,
      );

      expect(ContactService.prototype.createContact).toHaveBeenCalledWith(
        contactData,
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Message submitted successfully",
        contact,
      });
    });

    it("should handle internal server error", async () => {
      const contactData = {
        name: "John Doe",
        email: "johndoe@example.com",
        phone_number: "1234567890",
        message: "I would like to inquire about your services.",
      };

      (ContactService.prototype.createContact as jest.Mock).mockRejectedValue(
        new Error("Internal server error"),
      );

      req.body = contactData;

      await new ContactController().createContact(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});
