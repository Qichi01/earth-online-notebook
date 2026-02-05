"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finalize = async () => {
      await supabaseBrowser.auth.getSession();
      router.replace("/");
    };
    finalize();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-earth-bg text-earth-muted">
      正在完成登录...
    </div>
  );
}
