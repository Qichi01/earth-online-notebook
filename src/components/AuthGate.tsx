"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

const PUBLIC_ROUTES = new Set(["/auth", "/register", "/auth/callback"]);

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const check = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      if (!active) return;

      if (!data.session && !PUBLIC_ROUTES.has(pathname)) {
        router.replace("/auth");
      }

      setChecking(false);
    };

    check();

    const { data: subscription } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (!session && !PUBLIC_ROUTES.has(pathname)) {
        router.replace("/auth");
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
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
