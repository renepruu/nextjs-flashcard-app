export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        {/* Navbar moved to components/navbar.tsx and rendered in layout */}
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h1 className="text-2xl font-semibold">Welcome to Flashcard app</h1>
            <p className="text-sm text-foreground/70">
              Use the navigation above to get started.
            </p>
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16"></footer>
      </div>
    </main>
  );
}
