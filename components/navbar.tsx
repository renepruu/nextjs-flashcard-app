import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <span>Flashcard app</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/play" className="text-sm font-medium hover:underline">
            Play
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium hover:underline"
          >
            Categories
          </Link>
          <Link href="/cards" className="text-sm font-medium hover:underline">
            Cards
          </Link>
          <Link href="/stats" className="text-sm font-medium hover:underline">
            Statistics
          </Link>
        </div>
      </div>
    </nav>
  );
}
