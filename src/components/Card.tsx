import { ReactNode } from "react";

export default function Card({
  title,
  children,
  className = ""
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl bg-earth-card p-6 shadow-soft ${className}`}>
      {title ? <h2 className="mb-4 text-lg font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}
