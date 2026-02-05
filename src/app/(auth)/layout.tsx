export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-earth-bg">
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-10">
        {children}
      </main>
    </div>
  );
}
