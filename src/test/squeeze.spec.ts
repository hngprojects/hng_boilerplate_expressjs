// import { Request, Response } from "express";
// import { SqueezeController } from "../controllers/squeezecontroller";
// import { SqueezeService } from "../services";
// import { Conflict, ResourceNotFound, BadRequest } from "../middleware";

// jest.mock("../services", () => ({
//   SqueezeService: {
//     createSqueeze: jest.fn(),
//     updateSqueeze: jest.fn(),
//   },
// }));

// describe("SqueezeController", () => {
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

//   describe("createSqueeze", () => {
//     it("should successfully create a squeeze", async () => {
//       const squeezeData = { email: "test@example.com" };
//       const squeeze = { id: "123", ...squeezeData };

//       (SqueezeService.createSqueeze as jest.Mock).mockResolvedValue(squeeze);

//       req.body = squeezeData;

//       await SqueezeController.createSqueeze(req as Request, res as Response);

//       expect(SqueezeService.createSqueeze).toHaveBeenCalledWith(squeezeData);
//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({
//         status: 201,
//         status_code: 201,
//         message: "Squeeze created successfully",
//         data: squeeze,
//       });
//     });

//     it("should handle Conflict error", async () => {
//       const error = new Conflict("A squeeze already exists");
//       (SqueezeService.createSqueeze as jest.Mock).mockRejectedValue(error);

//       req.body = { email: "test@example.com" };

//       await SqueezeController.createSqueeze(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(error.status_code);
//       expect(res.json).toHaveBeenCalledWith({
//         status: 409,
//         status_code: error.status_code,
//         message: error.message,
//         data: null,
//       });
//     });

//     it("should handle generic errors", async () => {
//       const error = new Error("Some error");
//       (SqueezeService.createSqueeze as jest.Mock).mockRejectedValue(error);

//       req.body = { email: "test@example.com" };

//       await SqueezeController.createSqueeze(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({
//         status: 400,
//         status_code: 400,
//         message: error.message,
//         data: null,
//       });
//     });
//   });

//   describe("updateSqueeze", () => {
//     it("should successfully update a squeeze", async () => {
//       const email = "test@example.com";
//       const updateData = { phone: "1234567890" };
//       const squeeze = { email, ...updateData };

//       (SqueezeService.updateSqueeze as jest.Mock).mockResolvedValue(squeeze);

//       req.params = { email };
//       req.body = updateData;

//       await SqueezeController.updateSqueeze(req as Request, res as Response);

//       expect(SqueezeService.updateSqueeze).toHaveBeenCalledWith(
//         email,
//         updateData,
//       );
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         status: 200,
//         status_code: 200,
//         message: "Squeeze updated successfully",
//         data: squeeze,
//       });
//     });

//     it("should handle ResourceNotFound error", async () => {
//       const error = new ResourceNotFound("Squeeze not found");
//       (SqueezeService.updateSqueeze as jest.Mock).mockRejectedValue(error);

//       req.params = { email: "test@example.com" };
//       req.body = { phone: "1234567890" };

//       await SqueezeController.updateSqueeze(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(error.status_code);
//       expect(res.json).toHaveBeenCalledWith({
//         status: 404,
//         status_code: error.status_code,
//         message: error.message,
//         data: null,
//       });
//     });

//     it("should handle BadRequest error", async () => {
//       const error = new BadRequest("Invalid data");
//       (SqueezeService.updateSqueeze as jest.Mock).mockRejectedValue(error);

//       req.params = { email: "test@example.com" };
//       req.body = { phone: "1234567890" };

//       await SqueezeController.updateSqueeze(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(error.status_code);
//       expect(res.json).toHaveBeenCalledWith({
//         status: 400,
//         status_code: error.status_code,
//         message: error.message,
//         data: null,
//       });
//     });

//     it("should handle generic errors", async () => {
//       const error = new Error("Some error");
//       (SqueezeService.updateSqueeze as jest.Mock).mockRejectedValue(error);

//       req.params = { email: "test@example.com" };
//       req.body = { phone: "1234567890" };

//       await SqueezeController.updateSqueeze(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({
//         status: 400,
//         status_code: 400,
//         message: error.message,
//         data: null,
//       });
//     });
//   });
// });
