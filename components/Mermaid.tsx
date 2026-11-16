"use client";

import { useEffect, useId, useState } from "react";

// Lazy diagram renderer. The static HTML always contains the diagram source in
// a <pre>, so if JS is off, mermaid fails to load, or the syntax is invalid,
// the page still shows the source. The `mermaid` package is only imported
// (dynamic import, separate chunk) after mount, so pages without a diagram
// never fetch it.
export function Mermaid({ chart }: { chart: string }) {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: dark ? "dark" : "neutral",
        });
        const result = await mermaid.render(id, chart);
        if (!cancelled) setSvg(result.svg);
      } catch {
        // Keep the source fallback.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (svg) {
    return (
      <div
        className="my-4 overflow-x-auto border bg-surface p-3"
        role="img"
        aria-label="Diagram"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  return (
    <pre
      className="my-4 overflow-x-auto border bg-surface p-3 font-mono text-sm"
      data-mermaid-source=""
    >
      {chart}
    </pre>
  );
}
