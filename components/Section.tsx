import type { ReactNode } from "react";

export const H2 = "mb-3 border-b pb-1 text-lg font-semibold";
export const H3 = "mb-1 font-mono text-sm uppercase text-muted";

// Titled page section; `last` drops the bottom margin.
export function Section({
  id,
  title,
  last,
  children,
}: {
  id: string;
  title: ReactNode;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={last ? undefined : "mb-8"}>
      <h2 id={id} className={H2}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Bullets({
  items,
  className = "",
  ordered,
}: {
  items: readonly string[];
  className?: string;
  ordered?: boolean;
}) {
  const Tag = ordered ? "ol" : "ul";
  const list = ordered ? "list-decimal" : "list-disc";
  return (
    <Tag className={`max-w-3xl ${list} space-y-1 pl-5 ${className}`.trim()}>
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </Tag>
  );
}
