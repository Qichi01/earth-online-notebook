"use client";

import { useEffect } from "react";

export default function AuthCallbackPage() {
  useEffect(() => {
    let timer: number | undefined;

    const finalize = async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // Ignore logout failure and continue redirect.
      }

      timer = window.setTimeout(() => {
        window.location.replace("/auth?verified=1");
      }, 1800);
    };

    finalize();

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-earth-bg px-6 text-earth-text">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-soft">
        <div className="text-lg font-semibold">邮箱验证成功</div>
        <p className="mt-2 text-sm text-earth-muted">请使用邮箱和密码登录，正在为你跳转登录页...</p>
      </div>
    </div>
  );
}
