// import { Request, Response, NextFunction } from "express";
// import { UserController } from "../controllers/UserController";
// import { UserService } from "../services";
// import { sendJsonResponse } from "../helpers";

// jest.mock("../services", () => ({
//   UserService: {
//     getUserById: jest.fn(),
//   },
// }));

// jest.mock("../helpers", () => ({
//   sendJsonResponse: jest.fn(),
// }));

// describe("UserController", () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;
//   let next: jest.Mock;

//   beforeEach(() => {
//     req = {};
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//     next = jest.fn();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("getProfile", () => {
//     it("should handle BadRequest error when no ID is provided", async () => {
//       req.user = {};
//       console.log("req.user:", req.user);

//       await UserController.getProfile(req as Request, res as Response, next);
//       console.log(
//         "sendJsonResponse calls:",
//         (sendJsonResponse as jest.Mock).mock.calls,
//       );

//       expect(sendJsonResponse).toHaveBeenCalledWith(
//         res,
//         400,
//         "Unauthorized! No ID provided",
//         null,
//       );
//     });

//     it("should handle BadRequest error when invalid ID is provided", async () => {
//       req.user = { id: "invalid-uuid" };
//       console.log("req.user:", req.user);

//       await UserController.getProfile(req as Request, res as Response, next);
//       console.log(
//         "sendJsonResponse calls:",
//         (sendJsonResponse as jest.Mock).mock.calls,
//       );

//       expect(sendJsonResponse).toHaveBeenCalledWith(
//         res,
//         400,
//         "Unauthorized! Invalid User Id Format",
//         null,
//       );
//     });
//   });
// });
