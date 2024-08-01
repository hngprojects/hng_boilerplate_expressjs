import { Request, Response, NextFunction } from "express";
const bull_passkey = process.env.BULL_PASSKEY;
const checkBullPasskey = (req: Request, res: Response, next: NextFunction) => {
  const token = req.params.passkey;
  if (token === bull_passkey) {
    next();
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
};

export default checkBullPasskey;
