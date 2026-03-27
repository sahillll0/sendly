import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/**
 * Extracts and verifies the JWT from HttpOnly cookies
 * @param {Request} request 
 * @returns {Object|null} The decoded token payload or null if invalid
 */
export async function getAuthUser(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}
