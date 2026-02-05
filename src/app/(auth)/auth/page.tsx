"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage(null);
    if (!email.trim() || !password.trim()) {
      setMessage("请输入邮箱和密码。");
      return;
    }

    setLoading(true);
    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    });
    setLoading(false);

    if (error) {
      setMessage(`登录失败：${error.message}`);
      return;
    }

    window.location.href = "/";
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <div className="text-2xl font-semibold">欢迎回到地球 Online</div>
        <div className="text-sm text-earth-muted">使用邮箱 + 密码登录</div>
      </div>

      <Card title="邮箱登录">
        <div className="space-y-4 text-sm">
          <label className="grid gap-2">
            邮箱
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2"
              placeholder="name@example.com"
            />
          </label>
          <label className="grid gap-2">
            密码
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2"
              placeholder="至少 6 位"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="rounded-full bg-earth-accent px-5 py-2 text-white"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </div>

          {message ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700">
              {message}
            </div>
          ) : null}
        </div>
      </Card>

      <div className="text-sm text-earth-muted">
        还没有账号？
        <Link href="/register" className="ml-2 text-earth-accent underline">
          去注册
        </Link>
      </div>
    </div>
  );
}
