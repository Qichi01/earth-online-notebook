import { NextResponse } from "next/server";

const ACCESS_TOKEN_COOKIE = "eo_access_token";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const hasToken = cookieHeader.includes(`${ACCESS_TOKEN_COOKIE}=`);
  return NextResponse.json({ authenticated: hasToken });
}
