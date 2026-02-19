"use client";

import { useEffect } from "react";

export default function AuthCallbackPage() {
  useEffect(() => {
    // Email confirmation currently redirects here; user can login afterward.
    window.location.replace("/auth");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-earth-bg text-earth-muted">
      正在跳转到登录页...
    </div>
  );
}
