export type PatternItem = {
  title: string;
  path: string;
  points: string[];
};

export type PatternSection = {
  title: string;
  accent: string;
  items: PatternItem[];
};
export type PatternEntry = PatternItem & {
  slug: string;
  sectionTitle: string;
  sectionAccent: string;
  sectionIndex: number;
  itemIndex: number;
};

export type PatternGuide = {
  prerequisites: string[];
  implementation: string[];
  keyPoints: string[];
  memoryTip: string;
  relatedCase: string;
};

export const sections: PatternSection[] = [
  {
    title: "SOLID Design Principles",
    accent: "core",
    items: [
      {
        title: "Single Responsibility Principle",
        path: "/solid/single_responsibility.py",
        points: ["A class should have one reason to change."]
      },
      {
        title: "Open-Closed Principle",
        path: "/solid/open_closed.py",
        points: ["Software entities should be open for extension, closed for modification."]
      },
      {
        title: "Liskov Substitution Principle",
        path: "/solid/liskov.py",
        points: ["Subtypes should be replaceable for their base type without breaking behavior."]
      },
      {
        title: "Interface Segregation Principle",
        path: "/solid/interface_segregation.py",
        points: ["Clients should not depend on methods they do not use."]
      },
      {
        title: "Dependency Inversion Principle",
        path: "/solid/dependency_inversion.py",
        points: ["Depend on abstractions, not concretions."]
      }
    ]
  },
  {
    title: "Creational Design Patterns",
    accent: "make",
    items: [
      {
        title: "Builder",
        path: "/builder",
        points: [
          "A builder is a separate component for building an object.",
          "Can either give builder an initializer or return it via a static function.",
          "To make builder fluent, return self.",
          "Different facets of an object can be built with different builders working in tandem via a base class."
        ]
      },
      {
        title: "Factories (Factory Method and Abstract Factory)",
        path: "/factories",
        points: [
          "A factory method is a static method that creates object.",
          "A factory is an entity that can take care of object creation.",
          "A factory can be external or reside inside the object as an inner class.",
          "Hierarchies of factories can be used to create related objects."
        ]
      },
      {
        title: "Prototype",
        path: "/prototype",
        points: [
          "To implement a prototype, partially construct an object and store it somewhere.",
          "Deep copy the prototype.",
          "Customize the resulting instance.",
          "A factory provides a convenient API for using prototypes."
        ]
      },
      {
        title: "Singleton",
        path: "/singleton",
        points: [
          "Different realizations of Singleton: custom allocator, decorator, metaclass.",
          "Laziness is easy, just init on first request.",
          "Monostate variation.",
          "Testability issues."
        ]
      }
    ]
  },
  {
    title: "Structural Design Patterns",
    accent: "shape",
    items: [
      {
        title: "Adapter",
        path: "/adapter",
        points: [
          "Implementing an Adapter is easy.",
          "Determine the API you have and the API you need.",
          "Create a component which aggregates the adaptee.",
          "Intermediate representations can pile up: use caching and other optimizations."
        ]
      },
      {
        title: "Bridge",
        path: "/bridge/bridge.py",
        points: [
          "Decouple abstraction from implementation.",
          "Both can exist as hierarchies.",
          "A stronger form of encapsulation."
        ]
      },
      {
        title: "Composite",
        path: "/composite",
        points: [
          "Objects can use other objects via inheritance/composition.",
          "Some composed and singular objects need similar or identical behaviors.",
          "Composite design pattern lets us treat both types of objects uniformly.",
          "Python supports iteration with __iter__ and Iterable ABC.",
          "A single object can itself iterable by yielding self from __iter__."
        ]
      },
      {
        title: "Decorator",
        path: "/decorator",
        points: [
          "A decorator keeps the reference to the decorated object(s).",
          "Adds utility attributes and methods to augment the object's features.",
          "May or may not forward calls to the underlying object.",
          "Proxying of underlying calls can be done dynamically.",
          "Python's functional decorators wrap functions; no direct relation to GoF Decorator."
        ]
      },
      {
        title: "Facade",
        path: "/facade/facade.py",
        points: [
          "Build a Facade to provide a simplified API over a set of classes.",
          "May wish to optionally expose internals through the facade.",
          "May allow users to escalate to use more complex API."
        ]
      },
      {
        title: "Flyweight",
        path: "/flyweight",
        points: [
          "Store common data externally.",
          "Specify an index or a reference into the external data store.",
          "Define the idea of ranges on homogenous collections and store related data for those ranges."
        ]
      },
      {
        title: "Proxy",
        path: "/proxy",
        points: [
          "A proxy has the same interface as underlying object.",
          "To create a proxy, replicate the existing interface of an object.",
          "Add relevant functionality to the redefined member functions.",
          "Different proxies can have completely different behaviors."
        ]
      }
    ]
  },
  {
    title: "Behavioral Design Patterns",
    accent: "flow",
    items: [
      {
        title: "Chain of Responsibility",
        path: "/chain_of_res",
        points: [
          "Can be implemented as a chain of references or a centralized construct.",
          "Enlist objects in the chain, possibly controlling their order.",
          "Object removal from chain (for example __exit__)."
        ]
      },
      {
        title: "Command",
        path: "/command",
        points: [
          "Encapsulate all details of an operation in a separate object.",
          "Define instruction for applying the command.",
          "Optionally define instructions for undoing the command.",
          "Can create composite commands (macros)."
        ]
      },
      {
        title: "Interpreter",
        path: "/interpreter",
        points: [
          "Barring simple cases, an interpreter acts in two stages.",
          "Lexing turns text into a set of tokens.",
          "Parsing tokens into meaningful construct."
        ]
      },
      {
        title: "Iterator",
        path: "/iterator",
        points: [
          "An iterator specifies how you can traverse an object.",
          "Stateful iterators cannot be recursive.",
          "yield allows much more succinct iteration."
        ]
      },
      {
        title: "Mediator",
        path: "/mediator",
        points: [
          "Create the mediator and have each object refer to it.",
          "Mediator engages in bidirectional communication with connected components.",
          "Mediator has functions components can call.",
          "Components have functions mediator can call.",
          "Event processing libraries make communication easier."
        ]
      },
      {
        title: "Memento",
        path: "/memento",
        points: [
          "Mementos are used to roll back states arbitrarily.",
          "A memento is typically a token or handle class.",
          "A memento is not required to expose state directly.",
          "Can be used to implement undo and redo."
        ]
      },
      {
        title: "Observer",
        path: "/observer",
        points: [
          "Observer is intrusive: observable must provide an event to subscribe to.",
          "Subscription and unsubscription add or remove items in list.",
          "Property notifications are easy; dependent property notifications are tricky."
        ]
      },
      {
        title: "State",
        path: "/state",
        points: [
          "Given sufficient complexity, define possible states and events or triggers.",
          "Can define state entry and exit behaviors.",
          "Can define actions for transitions.",
          "Can define guard conditions for transitions.",
          "Can define default action when no transitions are found."
        ]
      },
      {
        title: "Strategy",
        path: "/strategy/strategy.py",
        points: [
          "Define an algorithm at a high level.",
          "Define the interface each strategy should follow.",
          "Provide dynamic composition of strategies in the resulting object."
        ]
      },
      {
        title: "Template",
        path: "/template/template.py",
        points: [
          "Define an algorithm at a high level in parent class.",
          "Define constituent parts as abstract methods or properties.",
          "Inherit the algorithm class and provide necessary overrides."
        ]
      },
      {
        title: "Visitor",
        path: "/visitor",
        points: [
          "OOP double-dispatch is not necessary in Python.",
          "Make a visitor and decorate each overload with @visitor.",
          "Call visit() and the entire structure gets traversed."
        ]
      }
    ]
  }
];

export const totalPatternCount = sections.reduce((sum, section) => sum + section.items.length, 0);

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const patternEntries: PatternEntry[] = sections.flatMap((section, sectionIndex) =>
  section.items.map((item, itemIndex) => ({
    ...item,
    slug: slugify(item.title),
    sectionTitle: section.title,
    sectionAccent: section.accent,
    sectionIndex,
    itemIndex
  }))
);

export function getPatternBySlug(slug: string): PatternEntry | undefined {
  return patternEntries.find((entry) => entry.slug === slug);
}

export function getNeighborPatterns(slug: string): { previous?: PatternEntry; next?: PatternEntry } {
  const index = patternEntries.findIndex((entry) => entry.slug === slug);
  if (index === -1) return {};
  return {
    previous: patternEntries[index - 1],
    next: patternEntries[index + 1]
  };
}

const sectionCases: Record<string, string> = {
  "SOLID Design Principles":
    "Refactor a module where one class keeps absorbing too many responsibilities and becomes hard to test.",
  "Creational Design Patterns":
    "Create complex objects (config, report, document) in multiple variants without polluting business logic.",
  "Structural Design Patterns":
    "Connect new code to existing systems or extend behavior while preserving stable APIs.",
  "Behavioral Design Patterns":
    "Coordinate events, state, commands, and processing flow with explicit rules."
};

const sectionPrerequisites: Record<string, string[]> = {
  "SOLID Design Principles": [
    "Identify classes or modules that currently carry too many responsibilities.",
    "List the most frequent change reasons in the codebase.",
    "Use incremental refactors instead of a single large API rewrite."
  ],
  "Creational Design Patterns": [
    "Identify objects that are complex to instantiate or duplicated in many places.",
    "Define consistent input data required for object creation.",
    "Separate creation concerns from business flow."
  ],
  "Structural Design Patterns": [
    "Document current API and target API expectations.",
    "Locate extension points where behavior can be added safely.",
    "Choose an adapter layer that encapsulates the change."
  ],
  "Behavioral Design Patterns": [
    "Define the core triggers, events, or states in your problem.",
    "List participating actors and their responsibilities.",
    "Agree on a future extension path before implementation."
  ]
};

export function buildGuide(entry: PatternEntry): PatternGuide {
  const prerequisites =
    sectionPrerequisites[entry.sectionTitle] ??
    sectionPrerequisites["Behavioral Design Patterns"];
  const implementation = [
    "Step 1: Scope the real problem and identify the highest-friction change points.",
    `Step 2: Review the code panel to locate where ${entry.title} is implemented.`,
    "Step 3: Apply key points in small, isolated changes.",
    "Step 4: Re-run tests or examples to verify behavior before and after refactor."
  ];

  const initials = entry.title
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((token) => token[0]?.toUpperCase())
    .join("");
  const memoryTip = `${entry.title}: remember acronym ${initials || "PATTERN"} and anchor it to "${entry.points[0]}".`;
  const relatedCase =
    sectionCases[entry.sectionTitle] ??
    "Use this when you need lower coupling, better extensibility, and clearer code boundaries.";

  return {
    prerequisites,
    implementation,
    keyPoints: entry.points,
    memoryTip,
    relatedCase
  };
}
