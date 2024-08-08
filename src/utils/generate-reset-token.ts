import crypto from "crypto";

const generateResetToken = (): {
  resetToken: string;
  hashedToken: string;
  expiresAt: Date;
} => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  return { resetToken, hashedToken, expiresAt };
};

export default generateResetToken;
