import { ErrorRequestHandler } from "express";
import { AppError, ValidationError } from "../types/errors";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ValidationError || err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Zod validation errors
  if (err.name === "ZodError") {
    res.status(400).json({ error: "Invalid data format", details: err.issues });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
};
