import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "地球 Online · 成就日记",
  description: "把生活翻译成成就的游戏化日记"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
