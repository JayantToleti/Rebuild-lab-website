import type { Metadata } from "next";
import { DataTable, Td, Th } from "@/components/DataTable";
import { PageHeading } from "@/components/PageHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Charter and baseline: operating principles, scope boundaries, local hardware constraints and the evidence standard.",
};

const H2 = "mb-3 border-b pb-1 text-lg font-semibold";

const PRINCIPLES: [string, string][] = [
  [
    "Implementation over superficial summaries",
    "Every substantial project includes working code or a clearly stated reason why it does not.",
  ],
  [
    "Evidence over claims",
    "Benchmarks include methodology, environment, raw or derived results and limitations.",
  ],
  [
    "Faithfulness with transparency",
    "Deviations from an original paper or product are documented explicitly.",
  ],
  [
    "Small, composable systems",
    "Projects are independently testable and deployable.",
  ],
  [
    "Public by default",
    "Original code and documentation are published under explicit licences, subject to upstream rights and safety constraints.",
  ],
  [
    "Quality over catalogue size",
    "A small number of complete projects is more valuable than many unfinished clones.",
  ],
  [
    "Reproducibility",
    "Dependencies, commands, configurations, data provenance and execution steps are recorded.",
  ],
  [
    "Scope honesty",
    "Scaled experiments are labelled as scaled reproductions, not full-scale replications.",
  ],
  [
    "Progressive complexity",
    "The platform begins with static documentation and grows only when a capability has a clear use case.",
  ],
];

const HARDWARE: [string, string][] = [
  ["Machine", "Windows laptop with VS Code"],
  ["Memory", "12 GB RAM"],
  ["GPU", "NVIDIA RTX 3050 laptop GPU"],
  ["VRAM", "4 GB"],
];

const SIZING: string[] = [
  "Small datasets and models",
  "Reduced batch sizes",
  "Gradient accumulation",
  "Mixed precision where supported",
  "Gradient checkpointing where useful",
  "CPU-based preprocessing",
];

const RECORDED: string[] = [
  "Hardware",
  "Driver",
  "CUDA / PyTorch versions",
  "Batch size",
  "Precision",
  "Seed",
  "Runtime",
];

const EVIDENCE_FIELDS: string[] = [
  "What was measured",
  "Why it was measured",
  "The environment",
  "The workload",
  "Tool and version",
  "Number of runs",
  "Aggregation method",
  "Known sources of noise",
];

const EVIDENCE_RULES: string[] = [
  "Separate measured facts, estimates and qualitative observations.",
  "Preserve raw results in machine-readable form where practical (CSV, JSON or Parquet).",
  "Include units and define whether latency is mean, median, p95, p99 or another statistic.",
  "State warm-up, run duration, concurrency, sample size and failure rate for load tests.",
  "Do not compare results from materially different hardware or configurations without explaining the difference.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeading title="Charter & Baseline" eyebrow="About">
        Rebuild Lab is a public engineering laboratory that documents how modern
        computing systems work by independently implementing, reproducing,
        testing, benchmarking and extending them. This page states the operating
        principles, scope boundaries, hardware baseline and evidence standard
        that every project is held to.
      </PageHeading>

      <section aria-labelledby="principles" className="mb-8">
        <h2 id="principles" className={H2}>
          Operating principles
        </h2>
        <DataTable>
          <thead>
            <tr>
              <Th className="w-1/3">Principle</Th>
              <Th>Meaning</Th>
            </tr>
          </thead>
          <tbody>
            {PRINCIPLES.map(([name, text]) => (
              <tr key={name}>
                <Td className="font-medium">{name}</Td>
                <Td>{text}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section aria-labelledby="scope" className="mb-8">
        <h2 id="scope" className={H2}>
          Scope boundaries
        </h2>
        <p className="mb-3 max-w-3xl">
          The platform may study commercial products and proprietary systems at
          the level of publicly documented behaviour, permitted APIs,
          interoperability and lawful testing.
        </p>
        <p className="mb-2 max-w-3xl">It does not publish:</p>
        <ul className="mb-3 max-w-3xl list-disc space-y-1 pl-5">
          <li>stolen source code</li>
          <li>secrets or private data</li>
          <li>authentication bypasses</li>
          <li>DRM circumvention instructions</li>
          <li>exploit workflows targeting systems without authorisation</li>
        </ul>
        <p className="max-w-3xl">
          Projects that involve security research require a written scope, a
          safe test environment and responsible disclosure where applicable.
        </p>
      </section>

      <section aria-labelledby="hardware" className="mb-8">
        <h2 id="hardware" className={H2}>
          Local hardware constraint disclosure
        </h2>
        <p className="mb-3 max-w-3xl">
          The initial local development environment is the machine below. Full-scale
          reproduction is not claimed when compute or data scale is materially
          smaller than the original paper.
        </p>
        <div className="mb-4 max-w-md">
          <DataTable>
            <tbody>
              {HARDWARE.map(([k, v]) => (
                <tr key={k}>
                  <Th scope="row" className="w-1/3">
                    {k}
                  </Th>
                  <Td className="font-mono text-xs">{v}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>

        <h3 className="mb-1 font-mono text-sm uppercase text-muted">
          Experiment sizing
        </h3>
        <p className="mb-2 max-w-3xl">
          ML projects are designed around this limit, using:
        </p>
        <ul className="mb-4 max-w-3xl list-disc space-y-1 pl-5">
          {SIZING.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h3 className="mb-1 font-mono text-sm uppercase text-muted">
          Practice
        </h3>
        <ul className="mb-4 max-w-3xl list-disc space-y-1 pl-5">
          <li>Use small, reproducible baselines before attempting larger runs.</li>
          <li>
            Keep dataset and model artefacts outside Git; document download and
            checksum steps.
          </li>
          <li>
            Treat memory limits as explicit experimental constraints, not as
            hidden implementation details.
          </li>
        </ul>

        <h3 className="mb-1 font-mono text-sm uppercase text-muted">
          Recorded for every run
        </h3>
        <ul className="flex flex-wrap gap-2">
          {RECORDED.map((r) => (
            <li key={r} className="border px-1.5 py-px font-mono text-xs">
              {r}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="evidence">
        <h2 id="evidence" className={H2}>
          Evidence standard
        </h2>
        <p className="mb-2 max-w-3xl">
          Every benchmark or experiment must state:
        </p>
        <ul className="mb-3 grid max-w-3xl list-disc gap-x-8 gap-y-1 pl-5 sm:grid-cols-2">
          {EVIDENCE_FIELDS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="mb-4 max-w-3xl">
          A chart without methodology is not accepted as benchmark evidence.
        </p>
        <ul className="max-w-3xl list-disc space-y-1 pl-5">
          {EVIDENCE_RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
