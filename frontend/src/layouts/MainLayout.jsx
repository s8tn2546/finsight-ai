export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">
              FinSight <span className="text-primary">AI</span>
            </h1>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      <footer className="mt-12 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-white/60">
          © {new Date().getFullYear()} FinSight AI
        </div>
      </footer>
    </div>
  );
}
