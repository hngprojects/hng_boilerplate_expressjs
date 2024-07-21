// @ts-nocheck

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Testimonial } from "../models/Testimonial";
import TestimonialsController from "../controllers/TestimonialsController";

jest.mock("../data-source", () => ({
	AppDataSource: {
		getRepository: jest.fn(),
	},
}));

describe("TestimonialsController", () => {
	let testimonialsController: TestimonialsController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockRepository: any;

	beforeEach(() => {
		testimonialsController = new TestimonialsController();
		mockRequest = {};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			send: jest.fn(),
		};
		mockRepository = {
			create: jest.fn(),
			save: jest.fn(),
			findOne: jest.fn(),
		};

		(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
	});

	describe("createTestimonial", () => {
		it("should create a new testimonial", async () => {
			const testimonialData = {
				client_name: "Client Name",
				client_position: "Client Position",
				testimonial: "This is a testimonial.",
			};

			mockRequest.body = testimonialData;
			(mockRequest as any).user = { id: 1 };

			const testimonialInstance = { id: 1, ...testimonialData, user_id: 1 };
			mockRepository.create.mockReturnValue(testimonialInstance);
			mockRepository.save.mockResolvedValue(testimonialInstance);

			await testimonialsController.createTestimonial(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockRepository.create).toHaveBeenCalledWith({
				user_id: 1,
				...testimonialData,
			});
			expect(mockRepository.save).toHaveBeenCalledWith(testimonialInstance);
			expect(mockResponse.status).toHaveBeenCalledWith(201);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Testimonial created successfully",
				status_code: 201,
				data: testimonialInstance,
			});
		});
	});

	describe("getTestimonial", () => {
		it("should retrieve a testimonial by ID", async () => {
			const testimonialId = "1";
			const testimonialInstance = {
				id: testimonialId,
				client_name: "Client Name",
				client_position: "Client Position",
				testimonial: "This is a testimonial.",
				user_id: 1,
			};

			mockRequest.params = { testimonial_id: testimonialId };
			mockRepository.findOne.mockResolvedValue(testimonialInstance);

			await testimonialsController.getTestimonial(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockRepository.findOne).toHaveBeenCalledWith({
				where: { id: testimonialId },
			});
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Testimonial retrieved successfully",
				status_code: 200,
				data: testimonialInstance,
			});
		});

		it("should return 404 if testimonial not found", async () => {
			const testimonialId = "1";

			mockRequest.params = { testimonial_id: testimonialId };
			mockRepository.findOne.mockResolvedValue(null);

			await testimonialsController.getTestimonial(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockRepository.findOne).toHaveBeenCalledWith({
				where: { id: testimonialId },
			});
			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.send).toHaveBeenCalledWith({
				message: "Testimonial not found",
				status_code: 404,
			});
		});

		it("should handle errors", async () => {
			const testimonialId = "1";
			const errorMessage = "Internal Server Error";

			mockRequest.params = { testimonial_id: testimonialId };
			mockRepository.findOne.mockRejectedValue(new Error(errorMessage));

			await testimonialsController.getTestimonial(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockRepository.findOne).toHaveBeenCalledWith({
				where: { id: testimonialId },
			});
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.send).toHaveBeenCalledWith({
				message: errorMessage,
			});
		});
	});

  
	describe("GET /api/v1/testimonials", () => {
		let mockFindAndCount;
		beforeAll(() => {
			mockFindAndCount = jest.fn().mockReturnValue([
				[
					{
						id: 1,
						client_name: "John Doe",
						client_designation: "CEO",
						testimonial: "Great service!",
						rating: 5,
						date: new Date(),
					},
					{
						id: 2,
						client_name: "Jane Smith",
						client_designation: "CTO",
						testimonial: "Excellent product!",
						rating: 4,
						date: new Date(),
					},
				],
				2,
			]);

			AppDataSource.getRepository.mockReturnValue({
				findAndCount: mockFindAndCount,
			});
		});

		it("should fetch all testimonials", async () => {
			const response = await request(app)
				.get("/api/v1/testimonials?page=1")
				.set("Authorization", "Bearer valid_token"); // Mock a valid token

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveLength(2);
			expect(response.body.pagination).toHaveProperty("current_page", 1);
		});

		it("should handle pagination correctly", async () => {
			const response = await request(app)
				.get("/api/v1/testimonials?page=2")
				.set("Authorization", "Bearer valid_token"); // Mock a valid token

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveLength(0);
			expect(response.body.pagination).toHaveProperty("current_page", 2);
		});

		it("should return 401 if no token is provided", async () => {
			const response = await request(app).get("/api/v1/testimonials?page=1");

			expect(response.status).toBe(401);
			expect(response.body).toHaveProperty(
				"message",
				"Authentication required"
			);
		});

		it("should return 500 if there is a server error", async () => {
			mockFindAndCount.mockImplementationOnce(() => {
				throw new Error("Database error");
			});

			const response = await request(app)
				.get("/api/v1/testimonials?page=1")
				.set("Authorization", "Bearer valid_token"); // Mock a valid token

			expect(response.status).toBe(500);
			expect(response.body).toHaveProperty(
				"message",
				"Error retrieving testimonials"
			);
		});
	});
});
