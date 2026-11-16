import type { Metadata } from "next";
import Link from "next/link";
import { ClassificationBadge } from "@/components/ClassificationBadge";
import { DataTable, Td, Th } from "@/components/DataTable";
import { PageHeading } from "@/components/PageHeading";
import { StatusBadge } from "@/components/StatusBadge";
import { LABS } from "@/lib/labs";
import { SITE } from "@/lib/site";
import { CLASSIFICATIONS, STATUSES } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Standards and protocols: contribution lifecycle, issue taxonomy (draft), reproduction gates, licensing expectations and security reporting.",
};

const H2 = "mb-3 border-b pb-1 text-lg font-semibold";
const H3 = "mb-1 font-mono text-sm uppercase text-muted";

const LIFECYCLE: [string, string, string, string][] = [
  [
    "0",
    "Intake",
    "Select a paper, system, protocol, algorithm or original problem. Define audience and value.",
    "Project brief, classification, domain, owner and initial scope.",
  ],
  [
    "1",
    "Research",
    "Read primary sources, specifications, related implementations and known limitations.",
    "Reference list, notes, terminology and behaviour requirements.",
  ],
  [
    "2",
    "Scope",
    "Define included and excluded functionality, scale, assumptions and success criteria.",
    "Scope statement and acceptance criteria.",
  ],
  [
    "3",
    "Design",
    "Choose architecture, components, interfaces, data flow and technology.",
    "Architecture diagram and design-decision record.",
  ],
  [
    "4",
    "Plan",
    "Break work into milestones and tasks. Identify risks and dependencies.",
    "Implementation plan and issue list.",
  ],
  [
    "5",
    "Build",
    "Implement a minimal vertical slice, then add features incrementally.",
    "Working implementation with reproducible setup.",
  ],
  [
    "6",
    "Verify",
    "Unit, integration, property, regression and failure tests as appropriate.",
    "Automated tests and test evidence.",
  ],
  [
    "7",
    "Evaluate",
    "Run experiments, benchmarks, ablations or behaviour comparisons.",
    "Raw results, analysis, charts and methodology.",
  ],
  [
    "8",
    "Document",
    "Explain architecture, implementation, operation, deviations and limitations.",
    "Complete project engineering record.",
  ],
  [
    "9",
    "Publish",
    "Release code, link project page, set status, licence and contribution path.",
    "Public repository and website entry.",
  ],
  [
    "10",
    "Maintain",
    "Triage issues, update dependencies, correct findings and retire obsolete demos.",
    "Changelog, maintenance status and follow-up issues.",
  ],
];

const REPRODUCTION: string[] = [
  "Identify the exact paper version, venue and supplementary material.",
  "Extract the paper's problem, method, model architecture, dataset, preprocessing, loss, optimiser, schedule and evaluation metrics.",
  "Create a reproduction matrix separating paper-reported settings from local implementation settings.",
  "Implement the smallest faithful model and validate tensor shapes and intermediate behaviour.",
  "Run a smoke test on a tiny dataset or short schedule.",
  "Run a baseline experiment with fixed seed and saved configuration.",
  "Run ablations only after the baseline is stable.",
  "Compare results with the paper while accounting for dataset, compute, hardware, precision and training budget differences.",
  "Publish deviations and confidence limits; do not imply exact reproduction where conditions differ.",
];

const RECREATION: string[] = [
  "Define externally visible behaviour and target feature set.",
  "Write requirements and API or protocol contracts.",
  "Model components, state transitions, storage and failure modes.",
  "Implement a minimal end-to-end path before adding scale or optional features.",
  "Add correctness tests and negative/failure-path tests.",
  "Measure throughput, latency, memory and resource use under declared conditions.",
  "Compare design choices with documented behaviour of the original system.",
  "Label the result as an educational or experimental implementation, not an official replacement.",
];

const LICENCE_ROWS: [string, string][] = [
  ["Original code", "Generally MIT, unless a project has a clear reason to use another permissive licence."],
  ["Original documentation", "May use Creative Commons Attribution 4.0 (CC BY 4.0)."],
  ["Every repository", "Contains a licence file."],
  [
    "Third-party material",
    "Datasets, models, images, papers, libraries and code retain their original licences and attribution requirements.",
  ],
];

const LICENCE_RULES: string[] = [
  "A permissive licence on Rebuild Lab code does not relicense upstream material.",
  "Paper PDFs are linked to their official source; redistribution occurs only when permitted.",
  "Datasets are accompanied by source, terms, citation and processing notes.",
  "Model weights are redistributed only when the model licence permits it.",
  "Third-party logos and product branding are used only where permitted and with clear non-affiliation language.",
];

const SECURITY_RULES: string[] = [
  "Secrets are stored in deployment secrets or a dedicated secret manager; never in Git or client-side bundles.",
  "Do not commit credentials, private datasets, large binaries or generated checkpoints.",
  "Private or personal data is not used in public examples without a lawful basis and explicit approval.",
  "Logs do not expose tokens, credentials, personal data or sensitive request payloads.",
];

export default function ContributePage() {
  return (
    <>
      <PageHeading title="Standards & Protocols" eyebrow="Contribute">
        How work moves from idea to publication, the gates a reproduction must
        pass, and the licensing and security expectations that apply to every
        contribution.
      </PageHeading>

      <section aria-labelledby="lifecycle" className="mb-8">
        <h2 id="lifecycle" className={H2}>
          Contribution lifecycle
        </h2>
        <p className="mb-3 max-w-3xl">
          Every project follows the same lifecycle, with project-specific depth.
          Each phase has a required output that acts as its gate.
        </p>
        <DataTable>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Phase</Th>
              <Th>Activity</Th>
              <Th>Required output / gate</Th>
            </tr>
          </thead>
          <tbody>
            {LIFECYCLE.map(([n, phase, activity, gate]) => (
              <tr key={n}>
                <Td className="font-mono text-xs">{n}</Td>
                <Td className="font-medium">{phase}</Td>
                <Td>{activity}</Td>
                <Td>{gate}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section aria-labelledby="workflows" className="mb-8">
        <h2 id="workflows" className={H2}>
          Workflows by classification
        </h2>
        <p className="mb-4 max-w-3xl">
          A project may carry more than one classification. Each classification
          has its own workflow.
        </p>

        <h3 className={`${H3} flex items-center gap-2`}>
          <ClassificationBadge classification="reproduction" /> Reproduction
        </h3>
        <p className="mb-2 max-w-3xl">
          Reimplementation or experimental reproduction of published research,
          algorithms or documented methods.
        </p>
        <ol className="mb-6 max-w-3xl list-decimal space-y-1 pl-5">
          {REPRODUCTION.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <h3 className={`${H3} flex items-center gap-2`}>
          <ClassificationBadge classification="recreation" /> Software recreation
        </h3>
        <p className="mb-2 max-w-3xl">
          Independent implementation of the core functionality of an existing
          application, protocol, infrastructure component or software system.
        </p>
        <ol className="mb-6 max-w-3xl list-decimal space-y-1 pl-5">
          {RECREATION.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <h3 className={`${H3} flex items-center gap-2`}>
          <ClassificationBadge classification="original-work" /> Original work
        </h3>
        <p className="max-w-3xl">
          Original work begins with a specific problem and a testable hypothesis
          or design objective. It records baseline behaviour, proposed change,
          evaluation plan, results, failed approaches and conclusions. A novel
          claim is made only when supported by a reproducible evaluation.
        </p>
      </section>

      <section aria-labelledby="taxonomy" className="mb-8">
        <h2 id="taxonomy" className={H2}>
          Issue taxonomy{" "}
          <span className="ml-1 border border-dashed px-1.5 py-px align-middle font-mono text-xs font-normal text-muted">
            DRAFT
          </span>
        </h2>
        <p className="mb-3 max-w-3xl border border-dashed p-3 text-sm text-muted">
          Draft. The founding proposal does not define an issue taxonomy. The
          labels below are derived from the classification, status and
          laboratory vocabularies used by the project registry and may change.
        </p>
        <DataTable>
          <thead>
            <tr>
              <Th>Label group</Th>
              <Th>Values</Th>
              <Th>Source</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className="font-mono text-xs">classification:*</Td>
              <Td>
                <ul className="flex flex-wrap gap-2">
                  {CLASSIFICATIONS.map((c) => (
                    <li key={c}>
                      <ClassificationBadge classification={c} />
                    </li>
                  ))}
                </ul>
              </Td>
              <Td className="text-muted">Registry classification</Td>
            </tr>
            <tr>
              <Td className="font-mono text-xs">status:*</Td>
              <Td>
                <ul className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <li key={s}>
                      <StatusBadge status={s} />
                    </li>
                  ))}
                </ul>
              </Td>
              <Td className="text-muted">Registry status</Td>
            </tr>
            <tr>
              <Td className="font-mono text-xs">lab:*</Td>
              <Td>
                <ul className="flex flex-wrap gap-2">
                  {LABS.map((l) => (
                    <li
                      key={l.slug}
                      className="border px-1.5 py-px font-mono text-xs leading-tight text-muted"
                    >
                      {l.slug}
                    </li>
                  ))}
                </ul>
              </Td>
              <Td className="text-muted">Registry category (laboratory)</Td>
            </tr>
          </tbody>
        </DataTable>
      </section>

      <section aria-labelledby="gates" className="mb-8">
        <h2 id="gates" className={H2}>
          Reproduction gates
        </h2>
        <p className="mb-2 max-w-3xl">
          A reproduction is not reported as complete until each of these holds:
        </p>
        <ul className="max-w-3xl list-disc space-y-1 pl-5">
          <li>
            The exact paper version, venue and supplementary material are
            identified.
          </li>
          <li>
            A reproduction matrix separates paper-reported settings from local
            implementation settings.
          </li>
          <li>
            Tensor shapes and intermediate behaviour are validated, and a smoke
            test passes on a tiny dataset or short schedule.
          </li>
          <li>
            A baseline experiment ran with a fixed seed and a saved
            configuration, before any ablation.
          </li>
          <li>
            Comparison with the paper accounts for dataset, compute, hardware,
            precision and training budget differences.
          </li>
          <li>
            Deviations and confidence limits are published; exact reproduction
            is not implied where conditions differ.
          </li>
          <li>
            Results meet the{" "}
            <Link href="/about#evidence" className="text-accent underline">
              evidence standard
            </Link>
            , and the run environment is recorded as described under{" "}
            <Link href="/about#hardware" className="text-accent underline">
              hardware constraints
            </Link>
            .
          </li>
        </ul>
      </section>

      <section aria-labelledby="licensing" className="mb-8">
        <h2 id="licensing" className={H2}>
          Licensing expectations
        </h2>
        <div className="mb-3">
          <DataTable>
            <tbody>
              {LICENCE_ROWS.map(([k, v]) => (
                <tr key={k}>
                  <Th scope="row" className="w-1/4">
                    {k}
                  </Th>
                  <Td>{v}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
        <ul className="max-w-3xl list-disc space-y-1 pl-5">
          {LICENCE_RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="security">
        <h2 id="security" className={H2}>
          Security reporting
        </h2>
        <p className="mb-3 max-w-3xl border border-dashed p-3 text-sm text-muted">
          Placeholder. Each repository describes a private reporting route and
          response expectations in its own <code className="font-mono">SECURITY.md</code>.
          No contact address is published on this site yet; report through the
          route given in the relevant repository under{" "}
          <a href={SITE.githubUrl} className="text-accent underline">
            github.com/{SITE.githubOrg}
          </a>
         
        </p>
        <ul className="max-w-3xl list-disc space-y-1 pl-5">
          {SECURITY_RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
