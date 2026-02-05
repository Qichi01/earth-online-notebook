import Link from "next/link";
import AuthGate from "@/components/AuthGate";

const navItems = [
  { href: "/", label: "日记" },
  { href: "/profile", label: "角色" },
  { href: "/history", label: "历史" },
  { href: "/settings", label: "设置" }
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-screen">
        <header className="sticky top-0 z-10 border-b border-black/5 bg-earth-bg/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div>
              <div className="text-lg font-semibold">地球 Online</div>
              <div className="text-sm text-earth-muted">成就日记 · v1</div>
            </div>
            <nav className="flex gap-4 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className="rounded-full px-3 py-1 transition hover:bg-earth-accent-soft"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </div>
    </AuthGate>
  );
}
