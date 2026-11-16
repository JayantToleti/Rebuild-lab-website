import type { ReactNode } from "react";

export function PageHeading({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 border-b pb-4">
      {eyebrow ? (
        <p className="mb-1 font-mono text-xs uppercase text-muted">{eyebrow}</p>
      ) : null}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {children ? <p className="mt-2 max-w-2xl text-muted">{children}</p> : null}
    </div>
  );
}
