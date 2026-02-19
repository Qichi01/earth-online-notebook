import { NextResponse } from "next/server";
import { signInWithPassword } from "@/lib/supabase/authProxy";

const ACCESS_TOKEN_COOKIE = "eo_access_token";
const REFRESH_TOKEN_COOKIE = "eo_refresh_token";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "").trim();

    if (!email || !password) {
      return NextResponse.json({ message: "请输入邮箱和密码" }, { status: 400 });
    }

    const session = await signInWithPassword(email, password);
    const response = NextResponse.json({ ok: true, user: session.user || null });

    response.cookies.set(ACCESS_TOKEN_COOKIE, session.access_token || "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: Number(session.expires_in || 3600)
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, session.refresh_token || "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "登录失败";
    return NextResponse.json({ message }, { status: 400 });
  }
}
