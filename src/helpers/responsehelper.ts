import { Response } from "express";

/**
 * Sends a JSON response with a standard structure.
 *
 * @param res - The Express response object.
 * @param statusCode - The HTTP status code to send.
 * @param message - The message to include in the response.
 * @param data - The data to include in the response. Can be any type.
 * @param accessToken - Optional access token to include in the response.
 */
const sendJsonResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any,
  accessToken?: string,
) => {
  const responsePayload: any = {
    status: statusCode,
    message,
    status_code: statusCode,
    data,
  };

  if (accessToken) {
    responsePayload.access_token = accessToken;
  }

  res.status(statusCode).json(responsePayload);
};

export { sendJsonResponse };
