// /app/api/users/me/route.ts
import { getUser } from "@/app/(frontend)/utils/getUser";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getUser();
  return Response.json(user);
}
