import Link from "next/link";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/#laboratories", label: "Laboratories" },
  { href: "/about", label: "About" },
  { href: "/contribute", label: "Contribute" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-mono text-sm font-semibold">
          {SITE.name}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex gap-4 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
