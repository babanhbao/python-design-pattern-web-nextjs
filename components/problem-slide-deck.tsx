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
import { PythonCodeBlock } from "./python-code-block";

type UmlGraphProps = {
  graph: ProblemLesson["umlStages"][number]["graph"];
  mermaidReady: boolean;
};

type InterviewQa = {
  question: string;
  answer: string;
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

function stripPainOrder(value: string): string {
  return value.replace(/^\s*\d+\.\s*/, "").trim();
}

function buildPainInterviewQa(
  details: string[],
  heading: string,
  patternTitle: string,
  lang: Lang
): InterviewQa[] {
  const cleanHeading = stripPainOrder(heading);
  return details.map((detail, index) => {
    if (lang === "en") {
      return {
        question: `Q${index + 1}. In an interview, how would you detect ${cleanHeading.toLowerCase()} in a real codebase?`,
        answer: `A${index + 1}. Look for this signal: ${detail}. Then explain that ${patternTitle} helps isolate this concern to reduce ripple effects.`
      };
    }

    return {
      question: `Q${index + 1}. Khi phỏng vấn, bạn nhận diện ${cleanHeading.toLowerCase()} trong code thực tế như thế nào?`,
      answer: `A${index + 1}. Dấu hiệu chính là: ${detail}. Sau đó giải thích ${patternTitle} giúp tách mối quan tâm này để giảm hiệu ứng dây chuyền.`
    };
  });
}

export default function ProblemSlideDeck() {
  const [lang, setLang] = useState<Lang>("en");
  const [openNav, setOpenNav] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState(problemLessons[0]?.id ?? "");
  const [mermaidReady, setMermaidReady] = useState(false);
  const [openRecognitionModal, setOpenRecognitionModal] = useState(false);
  const [openCodeModal, setOpenCodeModal] = useState(false);
  const [openPainModalIndex, setOpenPainModalIndex] = useState<number | null>(null);
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
          primaryColor: "#2a356f",
          primaryTextColor: "#f6f0d6",
          primaryBorderColor: "#ffd66e",
          lineColor: "#ffd66e",
          secondaryColor: "#1f2a62",
          tertiaryColor: "#17204e",
          tertiaryTextColor: "#132b75",
          edgeLabelBackground: "#ffd66e",
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

  useEffect(() => {
    setOpenRecognitionModal(false);
    setOpenCodeModal(false);
    setOpenPainModalIndex(null);
  }, [activeLessonId]);

  useEffect(() => {
    if (!openRecognitionModal && !openCodeModal && openPainModalIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenRecognitionModal(false);
        setOpenCodeModal(false);
        setOpenPainModalIndex(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openRecognitionModal, openCodeModal, openPainModalIndex]);

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
  const selectedPainBlock =
    lesson && openPainModalIndex !== null ? lesson.painBlocks[openPainModalIndex] ?? null : null;
  const selectedPainHeading = selectedPainBlock ? pickText(selectedPainBlock.heading, lang) : "";
  const selectedPainDetails = selectedPainBlock ? pickList(selectedPainBlock.details, lang) : [];
  const selectedPainInterviewQa =
    selectedPainBlock && lesson
      ? buildPainInterviewQa(selectedPainDetails, selectedPainHeading, lesson.title, lang)
      : [];

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
              <aside className="lesson-left-stack">
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
                    {lesson.painBlocks.map((block, index) => (
                      <article
                        aria-haspopup="dialog"
                        className="pain-block pain-block-trigger"
                        key={block.heading.en}
                        onClick={() => {
                          setOpenRecognitionModal(false);
                          setOpenCodeModal(false);
                          setOpenPainModalIndex(index);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setOpenRecognitionModal(false);
                            setOpenCodeModal(false);
                            setOpenPainModalIndex(index);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <h4>{pickText(block.heading, lang)}</h4>
                        <p className="pain-block-hint">
                          {lang === "en"
                            ? "Click to open interview Q&A for this pain section."
                            : "Bấm để mở bộ câu hỏi phỏng vấn cho pain section này."}
                        </p>
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

                <section className="panel panel-compare">
                  <h3>{ui.comparison}</h3>
                  <div className="comparison-table">
                    <div className="comparison-header">
                      <span className="comparison-cell comparison-aspect">{ui.comparisonAspect}</span>
                      <span className="comparison-cell comparison-no-pattern">
                        {ui.comparisonNoPattern}
                      </span>
                      <span className="comparison-cell comparison-with-pattern">
                        {ui.comparisonWithPattern}
                      </span>
                    </div>
                    {lesson.comparison.map((row) => (
                      <div className="comparison-row" key={row.aspect.en}>
                        <span className="comparison-cell comparison-aspect" data-label={ui.comparisonAspect}>
                          {pickText(row.aspect, lang)}
                        </span>
                        <span
                          className="comparison-cell comparison-no-pattern"
                          data-label={ui.comparisonNoPattern}
                        >
                          {pickText(row.noPattern, lang)}
                        </span>
                        <span
                          className="comparison-cell comparison-with-pattern"
                          data-label={ui.comparisonWithPattern}
                        >
                          {pickText(row.withPattern, lang)}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>

              <aside className="lesson-right-stack">
                <section
                  aria-haspopup="dialog"
                  className="panel panel-recognition recognition-card-trigger"
                  onClick={() => {
                    setOpenPainModalIndex(null);
                    setOpenCodeModal(false);
                    setOpenRecognitionModal(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setOpenPainModalIndex(null);
                      setOpenCodeModal(false);
                      setOpenRecognitionModal(true);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <h3>{ui.recognition}</h3>
                  <p className="recognition-hint">
                    {lang === "en"
                      ? "Click anywhere in this card to open full cues with code walkthrough."
                      : "Bấm ở bất kỳ vị trí nào trong card để mở bản chi tiết với code walkthrough."}
                  </p>
                  <ul>
                    {lesson.recognitionCues.map((cue, index) => (
                      <li key={`${lesson.id}-recognition-summary-${index}`}>
                        {pickText(cue.cue, lang)}
                      </li>
                    ))}
                  </ul>
                </section>

                <section
                  aria-haspopup="dialog"
                  className="panel panel-code panel-pattern-code code-card-trigger"
                  onClick={() => {
                    setOpenPainModalIndex(null);
                    setOpenRecognitionModal(false);
                    setOpenCodeModal(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setOpenPainModalIndex(null);
                      setOpenRecognitionModal(false);
                      setOpenCodeModal(true);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <h3>
                    {ui.naive} vs {ui.refactor}
                  </h3>
                  <p className="code-hint">
                    {lang === "en"
                      ? "Click anywhere in this card to open naive + refactor + modern dataclass version."
                      : "Bấm ở bất kỳ vị trí nào trong card để mở naive + refactor + phiên bản dataclass hiện đại."}
                  </p>
                  <div className="code-pair">
                    <section>
                      <h4>{ui.naive}</h4>
                      <PythonCodeBlock code={lesson.naiveCode} />
                    </section>
                    <section>
                      <h4>{ui.refactor}</h4>
                      <PythonCodeBlock code={lesson.patternCode} />
                    </section>
                  </div>
                  <h4 className="subheading">Code Explanation</h4>
                  <ul>
                    {pickList(lesson.patternCodeCommentary, lang).map((line) => (
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
              </aside>
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

          </article>
        ) : null}
      </section>

      {lesson && selectedPainBlock ? (
        <div
          className="pain-modal-overlay"
          onClick={() => setOpenPainModalIndex(null)}
          role="presentation"
        >
          <section
            aria-labelledby="pain-dialog-title"
            aria-modal="true"
            className="pain-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className="pain-modal-head">
              <h3 id="pain-dialog-title">{selectedPainHeading}</h3>
              <button onClick={() => setOpenPainModalIndex(null)} type="button">
                {ui.close}
              </button>
            </header>

            <p className="pain-modal-subtitle">
              {lang === "en"
                ? "Deep-dive on this pain section with interview-ready Q&A mapped to each signal."
                : "Phân tích sâu pain section này kèm bộ Q&A theo từng tín hiệu để dùng khi phỏng vấn."}
            </p>

            <section className="pain-modal-signals">
              <h4>{lang === "en" ? "Pain Signals" : "Tín hiệu đau"}</h4>
              <ul>
                {selectedPainDetails.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>

            <section className="pain-modal-interview">
              <h4>{lang === "en" ? "Interview Questions & Answers" : "Interview Questions & Answers"}</h4>
              <div className="pain-qa-grid">
                {selectedPainInterviewQa.map((qa, index) => (
                  <article className="pain-qa-item" key={`${selectedPainHeading}-qa-${index}`}>
                    <p className="pain-qa-question">{qa.question}</p>
                    <p className="pain-qa-answer">{qa.answer}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>
        </div>
      ) : null}

      {lesson && openRecognitionModal ? (
        <div
          className="recognition-modal-overlay"
          onClick={() => setOpenRecognitionModal(false)}
          role="presentation"
        >
          <section
            aria-labelledby="recognition-dialog-title"
            aria-modal="true"
            className="recognition-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className="recognition-modal-head">
              <h3 id="recognition-dialog-title">{ui.recognition}</h3>
              <button onClick={() => setOpenRecognitionModal(false)} type="button">
                {ui.close}
              </button>
            </header>

            <p className="recognition-modal-subtitle">
              {lang === "en"
                ? "Detailed cue-by-cue breakdown with code signals and why they matter."
                : "Bản chi tiết theo từng cue, gồm tín hiệu trong code và lý do cần chú ý."}
            </p>

            <div className="recognition-modal-grid">
              {lesson.recognitionCues.map((cue, index) => (
                <article className="recognition-item" key={`${lesson.id}-recognition-modal-${index}`}>
                  <h4>
                    {index + 1}. {pickText(cue.cue, lang)}
                  </h4>
                  <PythonCodeBlock className="recognition-code" code={cue.code} />
                  <p className="recognition-explanation">{pickText(cue.explanation, lang)}</p>
                </article>
              ))}
            </div>

            <section className="recognition-modal-commentary">
              <h4>{lang === "en" ? "Code Explanation" : "Giải thích code"}</h4>
              <ul>
                {pickList(lesson.patternCodeCommentary, lang).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          </section>
        </div>
      ) : null}

      {lesson && openCodeModal ? (
        <div className="code-modal-overlay" onClick={() => setOpenCodeModal(false)} role="presentation">
          <section
            aria-labelledby="code-dialog-title"
            aria-modal="true"
            className="code-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className="code-modal-head">
              <h3 id="code-dialog-title">
                {ui.naive} vs {ui.refactor} vs {ui.modern}
              </h3>
              <button onClick={() => setOpenCodeModal(false)} type="button">
                {ui.close}
              </button>
            </header>

            <p className="code-modal-subtitle">
              {lang === "en"
                ? "Compare three implementation styles side-by-side: baseline naive, pattern refactor, and modern Python dataclass style."
                : "So sánh 3 cách triển khai song song: naive nền tảng, refactor theo pattern, và style dataclass Python hiện đại."}
            </p>

            <div className="code-modal-grid">
              <article className="code-modal-item">
                <h4>{ui.naive}</h4>
                <PythonCodeBlock code={lesson.naiveCode} />
              </article>

              <article className="code-modal-item">
                <h4>{ui.refactor}</h4>
                <PythonCodeBlock code={lesson.patternCode} />
              </article>

              <article className="code-modal-item">
                <h4>{ui.modern}</h4>
                <PythonCodeBlock code={lesson.modernCode} />
              </article>
            </div>

            <section className="code-modal-commentary">
              <h4>{lang === "en" ? "Pattern Refactor Notes" : "Ghi chú Refactor theo Pattern"}</h4>
              <ul>
                {pickList(lesson.patternCodeCommentary, lang).map((line) => (
                  <li key={`pattern-${line}`}>{line}</li>
                ))}
              </ul>
              <h4>{lang === "en" ? "Modern Dataclass Notes" : "Ghi chú Dataclass Hiện đại"}</h4>
              <ul>
                {pickList(lesson.modernCodeCommentary, lang).map((line) => (
                  <li key={`modern-${line}`}>{line}</li>
                ))}
              </ul>
            </section>
          </section>
        </div>
      ) : null}
    </main>
  );
}
