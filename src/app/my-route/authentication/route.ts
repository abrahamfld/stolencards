import { NextResponse } from "next/server";
import { getPayload } from "payload";

export async function POST(req: Request) {
  const payload = await getPayload();
  const { action, username, email, password } = await req.json();

  try {
    switch (action) {
      case "login":
        const { user, token } = await payload.login({
          collection: "users",
          data: { email, password },
        });
        return NextResponse.json({ user, token });

      case "register":
        const newUser = await payload.create({
          collection: "users",
          data: { username, email, password, roles: ["user"] },
        });
        return NextResponse.json(newUser);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
