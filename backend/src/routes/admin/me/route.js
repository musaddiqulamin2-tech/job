import { expressify } from "../../../compat.js";
import { getSession, unauthorized } from "../../../lib/auth.js";


export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  return Response.json({
    success: true,
    admin: {
      id: session.id,
      name: session.name,
      email: session.email,
    },
  });
}
import { Router } from "express";
const router = Router();
router.get("/", expressify(GET));
export default router;
