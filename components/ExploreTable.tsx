"use client";

import { useMemo, useState } from "react";
import { LABS } from "@/lib/labs";
import {
  EMPTY_FILTERS,
  filterProjects,
  stackOptions,
  type Filters,
  type ProjectRow,
} from "@/lib/filter";
import { CLASSIFICATIONS, STATUSES } from "@/lib/taxonomy";
import { ProjectsTable } from "./ProjectsTable";

const SELECT_CLASS =
  "border bg-background px-2 py-1 font-mono text-xs text-foreground";

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted">
      <span className="font-mono uppercase">{label}</span>
      <select
        className={SELECT_CLASS}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ExploreTable({ rows }: { rows: ProjectRow[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const set = (key: keyof Filters) => (v: string) =>
    setFilters((f) => ({ ...f, [key]: v }));

  const visible = useMemo(() => filterProjects(rows, filters), [rows, filters]);
  const stacks = useMemo(() => stackOptions(rows), [rows]);
  const active = Object.values(filters).some(Boolean);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3 border bg-surface p-3">
        <Select
          label="Domain"
          value={filters.domain}
          options={LABS.map((l) => ({ value: l.slug, label: l.name }))}
          onChange={set("domain")}
        />
        <Select
          label="Status"
          value={filters.status}
          options={STATUSES.map((s) => ({ value: s, label: s }))}
          onChange={set("status")}
        />
        <Select
          label="Classification"
          value={filters.classification}
          options={CLASSIFICATIONS.map((c) => ({ value: c, label: c }))}
          onChange={set("classification")}
        />
        <Select
          label="Stack"
          value={filters.stack}
          options={stacks.map((s) => ({ value: s, label: s }))}
          onChange={set("stack")}
        />
        <button
          type="button"
          disabled={!active}
          onClick={() => setFilters(EMPTY_FILTERS)}
          className="border px-2 py-1 font-mono text-xs enabled:hover:bg-background disabled:text-muted"
        >
          Reset
        </button>
      </div>

      <p className="mb-2 font-mono text-xs text-muted" aria-live="polite">
        {visible.length} of {rows.length} projects
      </p>

      {visible.length > 0 ? (
        <ProjectsTable rows={visible} />
      ) : (
        <p className="border border-dashed p-4 text-sm text-muted">
          No projects match these filters.{" "}
          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="text-accent underline"
          >
            Clear filters
          </button>
        </p>
      )}
    </div>
  );
}
