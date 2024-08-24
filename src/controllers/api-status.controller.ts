import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  fetchApiStatusService,
  parseJsonResponse,
} from "../services/api-status.services";
import { sendJsonResponse } from "../utils/sendJsonResponse";

export const createApiStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const resultJson = req.body;

    await parseJsonResponse(resultJson);
    sendJsonResponse(res, 201, "API status updated successfully");
  },
);

export const getApiStatus = asyncHandler(
  async (_req: Request, res: Response) => {
    const response = await fetchApiStatusService();

    sendJsonResponse(res, 200, "Api status", { response });
  },
);
