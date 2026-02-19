"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_ROUTES = new Set(["/auth", "/register", "/auth/callback"]);

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await response.json()) as { authenticated?: boolean };
        if (!active) return;

        if (!data.authenticated && !PUBLIC_ROUTES.has(pathname)) {
          router.replace("/auth");
          return;
        }
      } catch {
        if (!PUBLIC_ROUTES.has(pathname)) {
          router.replace("/auth");
          return;
        }
      }

      setChecking(false);
    };

    check();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (checking && !PUBLIC_ROUTES.has(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-earth-bg text-earth-muted">
        正在进入地球 Online...
      </div>
    );
  }

  return <>{children}</>;
}
