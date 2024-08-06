import { Request, Response, NextFunction } from "express";
import { createContact } from "../controllers";
import { ContactService } from "../services";

jest.mock("../services/contactservice");
const mockCreateContact = ContactService.prototype.createContact as jest.Mock;

const mockRequest = (body = {}, params = {}, query = {}): Request =>
  ({
    body,
    params,
    query,
  }) as unknown as Request;

const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

const mockNext = (): NextFunction => jest.fn();

describe("createContact controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and success message when contact is created successfully", async () => {
    const mockContact = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone_number: "1234567890",
      message: "Hello!",
    };

    mockCreateContact.mockResolvedValue(mockContact);

    const req = mockRequest({ body: mockContact });
    const res = mockResponse();
    const next = mockNext();

    await createContact(req, res, next);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      message: "Message sent successfully",
      contact: mockContact,
    });
  });

  it("should handle errors and call next with the error", async () => {
    const error = new Error("Database error");
    mockCreateContact.mockRejectedValue(error);

    const req = mockRequest({ body: {} });
    const res = mockResponse();
    const next = mockNext();

    await createContact(req, res, next);

    expect(next).toBeCalledWith(error);
  });
});
