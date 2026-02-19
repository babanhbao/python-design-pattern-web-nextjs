"use client";

import Script from "next/script";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  deckText,
  pickList,
  pickText,
  problemLessons,
  type Lang,
  type ProblemLesson
} from "../lib/problem-slides";

type UmlGraphProps = {
  graph: ProblemLesson["umlStages"][number]["graph"];
  mermaidReady: boolean;
};

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void;
      render: (
        id: string,
        definition: string
      ) => Promise<{ svg: string; bindFunctions?: (element: Element) => void }>;
    };
  }
}

function toMermaidId(value: string): string {
  return `n_${value.replace(/[^a-zA-Z0-9_]/g, "_")}`;
}

function toMermaidLabel(value: string): string {
  return value.replace(/"/g, "'").replace(/\n/g, " ").replace(/\|/g, "/").trim();
}

function toMermaidEdgeLabel(value: string): string {
  return toMermaidLabel(value).replace(/[{}[\]<>]/g, "");
}

function buildMermaidDefinition(graph: ProblemLesson["umlStages"][number]["graph"]): string {
  const lines: string[] = ["flowchart TB"];

  for (const node of graph.nodes) {
    lines.push(`  ${toMermaidId(node.id)}["${toMermaidLabel(node.label)}"]`);
  }

  for (const edge of graph.edges) {
    const fromId = toMermaidId(edge.from);
    const toId = toMermaidId(edge.to);
    if (edge.label) {
      lines.push(`  ${fromId} -->|${toMermaidEdgeLabel(edge.label)}| ${toId}`);
    } else {
      lines.push(`  ${fromId} --> ${toId}`);
    }
  }

  return lines.join("\n");
}

function UmlGraph({ graph, mermaidReady }: UmlGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [renderError, setRenderError] = useState(false);
  const definition = useMemo(() => buildMermaidDefinition(graph), [graph]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();
    setRenderError(false);

    if (!mermaidReady || typeof window === "undefined" || !window.mermaid) return;

    let cancelled = false;

    const render = async () => {
      try {
        const renderId = `uml_${Math.random().toString(36).slice(2, 10)}`;
        const result = await window.mermaid!.render(renderId, definition);
        if (cancelled) return;
        container.innerHTML = result.svg;
        result.bindFunctions?.(container);
      } catch {
        if (!cancelled) {
          setRenderError(true);
        }
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [definition, mermaidReady]);

  return (
    <div className="uml-graph">
      <div className="uml-mermaid-shell" ref={containerRef} />
      {renderError ? (
        <pre className="uml-fallback">
          <code>{definition}</code>
        </pre>
      ) : null}
    </div>
  );
}

export default function ProblemSlideDeck() {
  const [lang, setLang] = useState<Lang>("en");
  const [openNav, setOpenNav] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState(problemLessons[0]?.id ?? "");
  const [mermaidReady, setMermaidReady] = useState(false);
  const mermaidInitialized = useRef(false);
  const ui = deckText[lang];

  const initMermaid = useCallback(() => {
    if (typeof window === "undefined" || !window.mermaid) return;
    if (!mermaidInitialized.current) {
      window.mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "base",
        themeVariables: {
          primaryColor: "#ffffff",
          primaryTextColor: "#173d57",
          primaryBorderColor: "#2d6d8f",
          lineColor: "#2d6d8f",
          secondaryColor: "#ebf6ff",
          tertiaryColor: "#f6fbff",
          fontFamily: "Space Grotesk"
        }
      });
      mermaidInitialized.current = true;
    }
    setMermaidReady(true);
  }, []);

  useEffect(() => {
    initMermaid();
  }, [initMermaid]);

  const groupedLessons = useMemo(() => {
    const map = new Map<string, typeof problemLessons>();
    for (const lesson of problemLessons) {
      const key = lesson.section.en;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(lesson);
    }
    return Array.from(map.entries());
  }, []);

  const lesson =
    problemLessons.find((item) => item.id === activeLessonId) ?? problemLessons[0] ?? null;

  return (
    <main className="course-page">
      <Script
        src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"
        strategy="afterInteractive"
        onLoad={initMermaid}
      />
      <header className="course-topbar">
        <button
          aria-label="Toggle navigation"
          className="hamburger"
          onClick={() => setOpenNav((value) => !value)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <div className="course-heading">
          <h1>{ui.title}</h1>
          <p>{ui.subtitle}</p>
        </div>

        <div className="lang-switch">
          <button
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
            type="button"
          >
            EN
          </button>
          <button
            className={lang === "vi" ? "active" : ""}
            onClick={() => setLang("vi")}
            type="button"
          >
            VI
          </button>
        </div>
      </header>

      <aside className={`drawer ${openNav ? "open" : ""}`}>
        <div className="drawer-head">
          <h2>{ui.navTitle}</h2>
          <button onClick={() => setOpenNav(false)} type="button">
            {ui.close}
          </button>
        </div>

        <nav className="drawer-nav">
          {groupedLessons.map(([sectionName, lessons]) => (
            <section key={sectionName}>
              <h3>
                {lang === "en"
                  ? lessons[0]?.section.en ?? sectionName
                  : lessons[0]?.section.vi ?? sectionName}
              </h3>
              {lessons.map((lesson) => (
                <button
                  className={activeLessonId === lesson.id ? "active" : ""}
                  key={lesson.id}
                  onClick={() => {
                    setActiveLessonId(lesson.id);
                    setOpenNav(false);
                  }}
                  type="button"
                >
                  <span>{lesson.order.toString().padStart(2, "0")}</span>
                  <span>
                    {pickText(lesson.businessProblem, lang)}{" "}
                    <em className="pattern-inline">({lesson.title})</em>
                  </span>
                </button>
              ))}
            </section>
          ))}
        </nav>
      </aside>

      {openNav ? <button className="drawer-overlay" onClick={() => setOpenNav(false)} /> : null}

      <section className="course-track">
        <article className="intro-card">
          <p>{ui.intro}</p>
        </article>

        {lesson ? (
          <article className="lesson" id={`lesson-${lesson.id}`}>
            <header className="lesson-head">
              <p>{pickText(lesson.team, lang)}</p>
              <h2>
                {pickText(lesson.problemLabel, lang)}{" "}
                <span className="pattern-inline">({lesson.title})</span>
              </h2>
              <div className="lesson-context-block">
                <p>
                  <strong>Context:</strong> {pickText(lesson.context, lang)}
                </p>
                <p>
                  <strong>Architectural Goal:</strong> {pickText(lesson.architecturalGoal, lang)}
                </p>
              </div>
              <div className="lesson-meta">
                <span>
                  {ui.section}: {pickText(lesson.section, lang)}
                </span>
                <span>
                  {ui.difficulty}: {pickText(lesson.difficulty, lang)}
                </span>
                <span>
                  {ui.context}: {pickText(lesson.context, lang)}
                </span>
              </div>
            </header>

            <div className="lesson-main-grid">
              <section className="panel panel-problem">
                <h3>{ui.problem}</h3>
                <p>{pickText(lesson.problem, lang)}</p>
                <div className="narrative-block">
                  {pickList(lesson.problemNarrative, lang).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                <h4 className="subheading">{ui.pain}</h4>
                <ul>
                  {pickList(lesson.pain, lang).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="pain-sections">
                  {lesson.painBlocks.map((block) => (
                    <article className="pain-block" key={block.heading.en}>
                      <h4>{pickText(block.heading, lang)}</h4>
                      <ul>
                        {pickList(block.details, lang).map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>

                <h4 className="subheading">{ui.solution}</h4>
                <ul>
                  {pickList(lesson.solution, lang).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>

              <aside className="panel panel-code panel-pattern-code">
                <h3>{ui.naive} vs {ui.refactor}</h3>
                <div className="code-pair">
                  <section>
                    <h4>{ui.naive}</h4>
                    <pre>
                      <code>{lesson.naiveCode}</code>
                    </pre>
                  </section>
                  <section>
                    <h4>{ui.refactor}</h4>
                    <pre>
                      <code>{lesson.patternCode}</code>
                    </pre>
                  </section>
                </div>
                <h4 className="subheading">Code Explanation</h4>
                <ul>
                  {pickList(lesson.patternCodeCommentary, lang).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </aside>
            </div>

            <div className="lesson-side-grid">
              <section className="panel panel-recognition">
                <h3>{ui.recognition}</h3>
                <ul>
                  {pickList(lesson.recognition, lang).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>

              <section className="panel panel-coupling">
                <h3>{ui.coupling}</h3>
                <div className="coupling-diagrams">
                  <article>
                    <h4>{ui.before}</h4>
                    <pre>
                      <code>{lesson.couplingDiagramBefore}</code>
                    </pre>
                  </article>
                  <article>
                    <h4>{ui.after}</h4>
                    <pre>
                      <code>{lesson.couplingDiagramAfter}</code>
                    </pre>
                  </article>
                </div>
                <p>
                  <strong>{ui.before}:</strong> {pickText(lesson.coupling.before, lang)}
                </p>
                <p>
                  <strong>{ui.after}:</strong> {pickText(lesson.coupling.after, lang)}
                </p>
                <p className="insight-label">{ui.insights}</p>
                <ul>
                  {pickList(lesson.coupling.insights, lang).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="lesson-slide">
              <section className="panel panel-uml">
                <h3>{ui.uml}</h3>
                <div className="uml-stages">
                  {lesson.umlStages.map((stage) => (
                    <article className="uml-stage" key={stage.title.en}>
                      <h4>{pickText(stage.title, lang)}</h4>
                      <p>{pickText(stage.thinking, lang)}</p>
                      <UmlGraph graph={stage.graph} mermaidReady={mermaidReady} />
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <div className="lesson-slide">
              <section className="panel panel-compare">
                <h3>{ui.comparison}</h3>
                <div className="comparison-table">
                  <div className="comparison-header">
                    <span>Aspect</span>
                    <span>No pattern</span>
                    <span>With pattern</span>
                  </div>
                  {lesson.comparison.map((row) => (
                    <div className="comparison-row" key={row.aspect.en}>
                      <span>{pickText(row.aspect, lang)}</span>
                      <span>{pickText(row.noPattern, lang)}</span>
                      <span>{pickText(row.withPattern, lang)}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel panel-analogy">
                <h3>{ui.analogy}</h3>
                <p>{pickText(lesson.analogy, lang)}</p>
                <h4 className="subheading">Strategic Outcome</h4>
                <ul>
                  {pickList(lesson.strategicOutcome, lang).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <h4 className="subheading">Core Insight</h4>
                <p>{pickText(lesson.coreInsight, lang)}</p>
              </section>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
