import { NextResponse } from "next/server";
import { signUpWithPassword } from "@/lib/supabase/authProxy";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "").trim();

    if (!email || !password) {
      return NextResponse.json({ message: "请输入邮箱和密码" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "";
    const redirectTo = origin ? `${origin}/auth/callback?verified=1` : "";

    await signUpWithPassword(email, password, redirectTo);

    return NextResponse.json({ ok: true, message: "注册成功，请前往邮箱验证后再登录" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "注册失败";
    return NextResponse.json({ message }, { status: 400 });
  }
}
