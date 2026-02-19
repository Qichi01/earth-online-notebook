"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setMessage(null);
    if (!email.trim() || !password.trim()) {
      setMessage("请输入邮箱和密码。");
      return;
    }

    if (password.length < 6) {
      setMessage("密码至少 6 位。");
      return;
    }

    if (password !== confirm) {
      setMessage("两次输入的密码不一致。");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      const data = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        setMessage(`注册失败：${data.message || "请稍后重试"}`);
        return;
      }

      setMessage(data.message || "注册成功，请前往邮箱完成验证后再登录。");
    } catch {
      setMessage("注册失败：网络不可用，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <div className="text-2xl font-semibold">创建你的地球 Online 账号</div>
        <div className="text-sm text-earth-muted">注册后需要验证邮箱</div>
      </div>

      <Card title="邮箱注册">
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
          <label className="grid gap-2">
            确认密码
            <input
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2"
              placeholder="再次输入密码"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="rounded-full bg-earth-accent px-5 py-2 text-white"
            >
              {loading ? "注册中..." : "注册"}
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
        已有账号？
        <Link href="/auth" className="ml-2 text-earth-accent underline">
          去登录
        </Link>
      </div>
    </div>
  );
}
