export type PatternSlide = {
  id: string;
  pattern: string;
  context: string;
  problem: string;
  pain: string[];
  solution: string[];
  fit: string;
  signals: string[];
};

export const introSlides = [
  {
    id: "start-here",
    kicker: "Design Patterns for Real Projects",
    title: "Learn by Pain, Not by Memorization",
    summary:
      "A pattern becomes useful only when it removes friction from a real codebase you are already shipping."
  },
  {
    id: "mistake-vs-right-way",
    kicker: "Most Common Mistake",
    title: "Learning 23 GoF Patterns Like Vocabulary Lists",
    summary:
      "Correct approach: start from a concrete problem, feel the pain, then pick the smallest pattern that actually solves it."
  }
] as const;

export const patternSlides: PatternSlide[] = [
  {
    id: "strategy",
    pattern: "Strategy",
    context: "Multiple workers in your face-recognition pipeline",
    problem: "Different worker types need different algorithms with the same execution contract.",
    pain: [
      "A giant if/elif block keeps growing for each new worker.",
      "Adding a new worker risks breaking old ones.",
      "Testing one algorithm requires spinning unrelated branches."
    ],
    solution: [
      "Define a shared strategy interface for worker execution.",
      "Implement one strategy class per processing behavior.",
      "Inject strategy at runtime so workers stay open for extension."
    ],
    fit: "You keep one stable orchestration flow while swapping algorithms safely.",
    signals: [
      "New worker types appear frequently.",
      "Behavior changes, but flow stays mostly the same.",
      "You want easier unit tests per algorithm."
    ]
  },
  {
    id: "command",
    pattern: "Command",
    context: "Task dispatch in multi-worker execution",
    problem: "You need to queue, retry, and log jobs without coupling the scheduler to business logic.",
    pain: [
      "Scheduler knows too much about each task function.",
      "Retries duplicate logic across call sites.",
      "Auditing who ran what is inconsistent."
    ],
    solution: [
      "Wrap each job as a command object with execute().",
      "Let dispatcher handle generic concerns: queue, retry, logging.",
      "Keep receiver logic focused on domain behavior only."
    ],
    fit: "Execution policy becomes reusable while task logic remains isolated.",
    signals: [
      "You need undo/retry/audit hooks.",
      "Dispatch logic is repeated across services.",
      "You want command history for troubleshooting."
    ]
  },
  {
    id: "pipeline",
    pattern: "Pipeline",
    context: "Thumbnail lane and classification lane split",
    problem: "You need independent stages with clear handoff contracts for throughput and observability.",
    pain: [
      "A monolithic function mixes preprocessing, thumbnailing, and classification.",
      "Any stage slowdown blocks the full flow.",
      "Metrics are too coarse to locate bottlenecks."
    ],
    solution: [
      "Split work into explicit stages with typed input/output boundaries.",
      "Run lanes independently when possible.",
      "Track latency and failure per stage."
    ],
    fit: "Parallelism and diagnostics improve without rewriting core logic.",
    signals: [
      "Stages are logically separate.",
      "You need per-stage scaling.",
      "You need per-stage SLO visibility."
    ]
  },
  {
    id: "chain-of-responsibility",
    pattern: "Chain of Responsibility",
    context: "Validation and fallback handling in the processing flow",
    problem: "Requests should pass through ordered handlers until one can process or reject them.",
    pain: [
      "Conditional branching duplicates validation rules everywhere.",
      "Reordering checks is risky and expensive.",
      "Default fallback behavior is unclear."
    ],
    solution: [
      "Compose handlers as a chain with a single next reference.",
      "Each handler decides: handle, pass forward, or stop.",
      "Keep fallback handler explicit at the end."
    ],
    fit: "You gain configurable flow control with low coupling between checks.",
    signals: [
      "You have an ordered set of checks or enrichments.",
      "You need easy reordering of logic.",
      "Each step should be independently testable."
    ]
  },
  {
    id: "producer-consumer",
    pattern: "Producer-Consumer",
    context: "Job queue management",
    problem: "Producers and workers operate at different speeds and must be decoupled safely.",
    pain: [
      "Sudden traffic spikes overwhelm workers.",
      "Direct calls from producer to worker drop requests under load.",
      "Backpressure behavior is undefined."
    ],
    solution: [
      "Introduce a queue between producers and consumers.",
      "Scale consumers independently from producers.",
      "Use bounded queues and retry policy for controlled pressure."
    ],
    fit: "Throughput and reliability improve when workload is bursty.",
    signals: [
      "Input rate is uneven.",
      "Workers have variable processing time.",
      "You need explicit buffering and backpressure."
    ]
  },
  {
    id: "observer",
    pattern: "Observer",
    context: "Shared state updates tile color in UI/dashboard",
    problem: "Multiple views must react to state changes without direct coupling to state internals.",
    pain: [
      "Manual UI refresh calls are scattered and fragile.",
      "Adding one subscriber forces edits in many places.",
      "State updates and UI rendering are tightly entangled."
    ],
    solution: [
      "Publish state-change events from observable state.",
      "Let views subscribe and update themselves.",
      "Keep observer payloads concise and predictable."
    ],
    fit: "State remains central while dependent components evolve independently.",
    signals: [
      "One source, many listeners.",
      "Listeners change often.",
      "You need reactive updates without tight coupling."
    ]
  },
  {
    id: "factory",
    pattern: "Factory",
    context: "Creating different processor types by config or job type",
    problem: "Object creation rules vary, and constructors leak into orchestration code.",
    pain: [
      "Creation logic is duplicated across modules.",
      "Config branching pollutes business flow.",
      "New processor types require touching too many files."
    ],
    solution: [
      "Centralize creation in a factory entry point.",
      "Map config/job type to concrete processor classes.",
      "Return interface-compatible processors to callers."
    ],
    fit: "You can add processor variants with minimal orchestration changes.",
    signals: [
      "Creation depends on runtime config.",
      "Variants share one interface.",
      "You want cleaner composition roots."
    ]
  }
];
