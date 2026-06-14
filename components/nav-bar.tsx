import Link from "next/link";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/activity", label: "Activity" },
  { href: "/developers", label: "Developers" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
          TrustGuard
        </Link>

        <nav className="flex items-center gap-6 text-sm text-text-dim">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-text">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}