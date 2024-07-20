import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export const generateToken = (payload: Record<string, unknown>) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): Record<string, unknown> | null => {
  try {
    const payload = jwt.verify(token, SECRET);
    return payload as Record<string, unknown>;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
