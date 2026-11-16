import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-4 font-mono text-xs text-muted">
        <span>
          {SITE.name} v{SITE.version}
        </span>
        <span>Code: MIT · Docs: CC BY 4.0</span>
        <span className="flex gap-4">
          <a href={SITE.githubUrl} className="hover:text-foreground">
            github.com/{SITE.githubOrg}
          </a>
          <Link href="/contribute" className="hover:text-foreground">
            Contribute
          </Link>
        </span>
      </div>
    </footer>
  );
}
