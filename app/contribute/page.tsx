import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ClassificationBadge } from "@/components/ClassificationBadge";
import { DataTable, Td, Th } from "@/components/DataTable";
import { PageHeading } from "@/components/PageHeading";
import { Bullets, H3, Section } from "@/components/Section";
import { StatusBadge } from "@/components/StatusBadge";
import { LABS } from "@/lib/labs";
import { SITE } from "@/lib/site";
import { CLASSIFICATIONS, STATUSES, type Classification } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Standards and protocols: contribution lifecycle, issue taxonomy (draft), reproduction gates, licensing expectations and security reporting.",
};

const LIFECYCLE: [string, string, string, string][] = [
  ["0", "Intake", "Select a paper, system, protocol, algorithm or original problem. Define audience and value.", "Project brief, classification, domain, owner and initial scope."],
  ["1", "Research", "Read primary sources, specifications, related implementations and known limitations.", "Reference list, notes, terminology and behaviour requirements."],
  ["2", "Scope", "Define included and excluded functionality, scale, assumptions and success criteria.", "Scope statement and acceptance criteria."],
  ["3", "Design", "Choose architecture, components, interfaces, data flow and technology.", "Architecture diagram and design-decision record."],
  ["4", "Plan", "Break work into milestones and tasks. Identify risks and dependencies.", "Implementation plan and issue list."],
  ["5", "Build", "Implement a minimal vertical slice, then add features incrementally.", "Working implementation with reproducible setup."],
  ["6", "Verify", "Unit, integration, property, regression and failure tests as appropriate.", "Automated tests and test evidence."],
  ["7", "Evaluate", "Run experiments, benchmarks, ablations or behaviour comparisons.", "Raw results, analysis, charts and methodology."],
  ["8", "Document", "Explain architecture, implementation, operation, deviations and limitations.", "Complete project engineering record."],
  ["9", "Publish", "Release code, link project page, set status, licence and contribution path.", "Public repository and website entry."],
  ["10", "Maintain", "Triage issues, update dependencies, correct findings and retire obsolete demos.", "Changelog, maintenance status and follow-up issues."],
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

const GATES: string[] = [
  "The exact paper version, venue and supplementary material are identified.",
  "A reproduction matrix separates paper-reported settings from local implementation settings.",
  "Tensor shapes and intermediate behaviour are validated, and a smoke test passes on a tiny dataset or short schedule.",
  "A baseline experiment ran with a fixed seed and a saved configuration, before any ablation.",
  "Comparison with the paper accounts for dataset, compute, hardware, precision and training budget differences.",
  "Deviations and confidence limits are published; exact reproduction is not implied where conditions differ.",
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
  const pill = "border px-1.5 py-px font-mono text-xs leading-tight text-muted";
  const taxonomy: [string, string, ReactNode[]][] = [
    [
      "classification:*",
      "Registry classification",
      CLASSIFICATIONS.map((c) => <ClassificationBadge key={c} classification={c} />),
    ],
    [
      "status:*",
      "Registry status",
      STATUSES.map((s) => <StatusBadge key={s} status={s} />),
    ],
    [
      "lab:*",
      "Registry category (laboratory)",
      LABS.map((l) => (
        <span key={l.slug} className={pill}>
          {l.slug}
        </span>
      )),
    ],
  ];
  const workflows: [Classification, string, string, ReactNode][] = [
    [
      "reproduction",
      "Reproduction",
      "Reimplementation or experimental reproduction of published research, algorithms or documented methods.",
      <Bullets key="r" ordered items={REPRODUCTION} className="mb-6" />,
    ],
    [
      "recreation",
      "Software recreation",
      "Independent implementation of the core functionality of an existing application, protocol, infrastructure component or software system.",
      <Bullets key="s" ordered items={RECREATION} className="mb-6" />,
    ],
    [
      "original-work",
      "Original work",
      "Original work begins with a specific problem and a testable hypothesis or design objective. It records baseline behaviour, proposed change, evaluation plan, results, failed approaches and conclusions. A novel claim is made only when supported by a reproducible evaluation.",
      null,
    ],
  ];

  return (
    <>
      <PageHeading title="Standards & Protocols" eyebrow="Contribute">
        How work moves from idea to publication, the gates a reproduction must
        pass, and the licensing and security expectations that apply to every
        contribution.
      </PageHeading>

      <Section id="lifecycle" title="Contribution lifecycle">
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
      </Section>

      <Section id="workflows" title="Workflows by classification">
        <p className="mb-4 max-w-3xl">
          A project may carry more than one classification. Each classification
          has its own workflow.
        </p>
        {workflows.map(([c, name, intro, steps]) => (
          <div key={c}>
            <h3 className={`${H3} flex items-center gap-2`}>
              <ClassificationBadge classification={c} /> {name}
            </h3>
            <p className={`max-w-3xl ${steps ? "mb-2" : ""}`}>{intro}</p>
            {steps}
          </div>
        ))}
      </Section>

      <Section
        id="taxonomy"
        title={
          <>
            Issue taxonomy{" "}
            <span className="ml-1 border border-dashed px-1.5 py-px align-middle font-mono text-xs font-normal text-muted">
              DRAFT
            </span>
          </>
        }
      >
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
            {taxonomy.map(([group, source, values]) => (
              <tr key={group}>
                <Td className="font-mono text-xs">{group}</Td>
                <Td>
                  <ul className="flex flex-wrap gap-2">
                    {values.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </Td>
                <Td className="text-muted">{source}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </Section>

      <Section id="gates" title="Reproduction gates">
        <p className="mb-2 max-w-3xl">
          A reproduction is not reported as complete until each of these holds:
        </p>
        <ul className="max-w-3xl list-disc space-y-1 pl-5">
          {GATES.map((g) => (
            <li key={g}>{g}</li>
          ))}
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
      </Section>

      <Section id="licensing" title="Licensing expectations">
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
        <Bullets items={LICENCE_RULES} />
      </Section>

      <Section id="security" title="Security reporting" last>
        <p className="mb-3 max-w-3xl border border-dashed p-3 text-sm text-muted">
          Placeholder. Each repository describes a private reporting route and
          response expectations in its own <code className="font-mono">SECURITY.md</code>.
          No contact address is published on this site yet; report through the
          route given in the relevant repository under{" "}
          <a href={SITE.githubUrl} className="text-accent underline">
            github.com/{SITE.githubOrg}
          </a>
        </p>
        <Bullets items={SECURITY_RULES} />
      </Section>
    </>
  );
}
