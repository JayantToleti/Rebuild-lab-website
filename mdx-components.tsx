import { isValidElement, type ComponentProps, type ReactElement } from "react";
import type { MDXComponents } from "mdx/types";
import { DataTable, Td, Th } from "@/components/DataTable";
import { Mermaid } from "@/components/Mermaid";

// A ```mermaid fence compiles to <pre><code className="language-mermaid">src</code></pre>.
// Detect it here so no function-valued remark/rehype plugin is needed (Turbopack
// only accepts string plugin names). Pages without a mermaid fence never mount
// <Mermaid>, so the mermaid package is never fetched for them.
function mermaidSource(children: ComponentProps<"pre">["children"]): string | null {
  if (!isValidElement(children)) return null;
  const { className, children: text } = (children as ReactElement<ComponentProps<"code">>).props;
  if (typeof className !== "string" || !/\blanguage-mermaid\b/.test(className)) return null;
  return typeof text === "string" ? text.trim() : null;
}

// Flat, dense styling per Spec §1: 1px borders (design tokens), monospace accents, no shadows.
const components: MDXComponents = {
  Mermaid,
  h2: (props) => (
    <h2 className="mt-8 mb-3 border-b pb-1 text-lg font-semibold" {...props} />
  ),
  h3: (props) => <h3 className="mt-6 mb-2 text-base font-semibold" {...props} />,
  p: (props) => <p className="my-3 leading-relaxed" {...props} />,
  ul: (props) => <ul className="my-3 list-disc pl-6" {...props} />,
  ol: (props) => <ol className="my-3 list-decimal pl-6" {...props} />,
  a: (props) => (
    <a className="text-accent underline underline-offset-2" {...props} />
  ),
  code: (props) => <code className="font-mono text-[0.9em]" {...props} />,
  pre: (props) => {
    const chart = mermaidSource(props.children);
    if (chart) return <Mermaid chart={chart} />;
    return (
      <pre
        className="my-4 overflow-x-auto border bg-surface p-3 font-mono text-sm"
        {...props}
      />
    );
  },
  table: (props) => (
    <div className="my-4">
      <DataTable {...props} />
    </div>
  ),
  th: (props) => <Th {...props} />,
  td: (props) => <Td {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
