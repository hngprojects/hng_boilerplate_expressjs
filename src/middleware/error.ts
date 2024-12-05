import { NextFunction, Request, Response } from "express";

class HttpError extends Error {
  status_code: number;
  success: boolean = false;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status_code = statusCode;
  }
}

class BadRequest extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}

class ResourceNotFound extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}

class Unauthorized extends HttpError {
  constructor(message: string) {
    super(401, message);
  }
}

class Forbidden extends HttpError {
  constructor(message: string) {
    super(403, message);
  }
}

class Conflict extends HttpError {
  constructor(message: string) {
    super(409, message);
  }
}

class InvalidInput extends HttpError {
  constructor(message: string) {
    super(422, message);
  }
}

class ServerError extends HttpError {
  constructor(message: string) {
    super(500, message);
  }
}

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  const message = `Route not found: ${req.originalUrl}`;
  res.status(404).json({ success: false, status: 404, message });
};

const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const {
    success = false,
    status_code = 500,
    message = "An unexpected error occurred",
  } = err;

  const cleanedMessage = message.replace(/"/g, "");

  res.status(status_code).json({
    success,
    status_code,
    message: cleanedMessage,
  });
};

export {
  BadRequest,
  Conflict,
  errorHandler,
  Forbidden,
  HttpError,
  InvalidInput,
  ResourceNotFound,
  routeNotFound,
  ServerError,
  Unauthorized,
};
