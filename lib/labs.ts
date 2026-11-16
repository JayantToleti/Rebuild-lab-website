// The nine laboratory domains (Proposal §3.1). Static data; no I/O, so it is
// safe to import from server and client code alike.
export type Lab = {
  slug: string;
  name: string;
  scope: string;
  examples: readonly string[];
};

export const LABS = [
  {
    slug: "ai-ml",
    name: "AI & Machine Learning",
    scope:
      "Deep learning architectures, training methods, inference, evaluation and model systems.",
    examples: ["ResNet", "U-Net", "Transformer", "ViT", "LoRA", "diffusion", "model serving"],
  },
  {
    slug: "distributed-systems",
    name: "Distributed Systems",
    scope:
      "Coordination, replication, consistency, messaging, fault tolerance and distributed execution.",
    examples: ["Kafka-like broker", "leader election", "consensus", "distributed cache"],
  },
  {
    slug: "databases-storage",
    name: "Databases & Storage",
    scope:
      "Storage engines, indexing, query execution, transactions, caching and data systems.",
    examples: ["Redis-like key-value store", "B-tree", "mini relational database"],
  },
  {
    slug: "cloud-infrastructure",
    name: "Cloud & Infrastructure",
    scope:
      "Containers, orchestration, scheduling, deployment, service discovery and platform engineering.",
    examples: ["Mini Kubernetes scheduler", "deployment controller", "container lifecycle"],
  },
  {
    slug: "networking",
    name: "Networking",
    scope:
      "Protocols, routing, sockets, traffic management and network observability.",
    examples: ["HTTP explorer", "TCP experiments", "rate limiter", "load balancer"],
  },
  {
    slug: "system-design",
    name: "System Design & Applications",
    scope: "End-to-end applications and the architecture behind familiar products.",
    examples: ["URL shortener", "chat application", "search engine", "video delivery"],
  },
  {
    slug: "programming-languages-cs",
    name: "Programming Languages & CS",
    scope: "Language runtimes, parsers, compilers, operating systems and algorithms.",
    examples: ["JSON parser", "shell", "Git internals", "memory allocator"],
  },
  {
    slug: "reverse-engineering",
    name: "Reverse Engineering",
    scope:
      "Behavioural analysis of permitted systems, file formats, protocols and public interfaces.",
    examples: ["Protocol inspection", "compatibility tools", "file-format readers"],
  },
  {
    slug: "observability",
    name: "Observability",
    scope:
      "Metrics, logs, traces, telemetry pipelines and operational diagnosis.",
    examples: ["Mini Prometheus", "telemetry collector", "alerting pipeline"],
  },
] as const satisfies readonly Lab[];

export type LabSlug = (typeof LABS)[number]["slug"];

export const LAB_SLUGS = LABS.map((l) => l.slug) as [LabSlug, ...LabSlug[]];

export function getLab(slug: string): (typeof LABS)[number] | undefined {
  return LABS.find((l) => l.slug === slug);
}
