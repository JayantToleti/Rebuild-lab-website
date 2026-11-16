import type { ComponentProps } from "react";

// Shared table primitives: flat, dense, 1px borders, tabular numerals.
export function DataTable(props: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto">
      <table
        {...props}
        className={`w-full border-collapse text-sm tabular-nums ${props.className ?? ""}`}
      />
    </div>
  );
}

export function Th(props: ComponentProps<"th">) {
  return (
    <th
      {...props}
      className={`border bg-surface px-2 py-1 text-left font-mono text-xs font-medium ${props.className ?? ""}`}
    />
  );
}

export function Td(props: ComponentProps<"td">) {
  return (
    <td
      {...props}
      className={`border px-2 py-1 align-top ${props.className ?? ""}`}
    />
  );
}
