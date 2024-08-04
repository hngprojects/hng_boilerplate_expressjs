import { OAuth2Client } from "google-auth-library";
import { BadRequest } from "../middleware";
const client = new OAuth2Client();

export async function verifyToken(idToken: string): Promise<any> {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Unable to verify token");
    }
    return payload;
  } catch (error) {
    throw new BadRequest("Invalid token");
  }
}
