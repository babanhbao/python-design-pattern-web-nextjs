import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildGuide,
  getNeighborPatterns,
  getPatternBySlug,
  patternEntries
} from "../../../lib/pattern-data";
import { getPatternCodePanels } from "../../../lib/pattern-source";

type PatternPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return patternEntries.map((entry) => ({ slug: entry.slug }));
}

export default async function PatternDetailPage({ params }: PatternPageProps) {
  const { slug } = await params;
  const entry = getPatternBySlug(slug);
  if (!entry) notFound();

  const guide = buildGuide(entry);
  const code = await getPatternCodePanels(entry);
  const { previous, next } = getNeighborPatterns(slug);

  return (
    <main className="detail-page">
      <header className="detail-hero">
        <Link className="back-link" href="/">
          ← Back to slides
        </Link>
        <p>{entry.sectionTitle}</p>
        <h1>{entry.title}</h1>
        <span>Path: {entry.path}</span>
      </header>

      <div className="detail-layout">
        <section className="code-column">
          <h2>Code by snippet</h2>
          {code.message ? <p className="detail-note">{code.message}</p> : null}
          {code.panels.map((panel) => (
            <article className="code-panel" key={panel.file}>
              <h3>{panel.file}</h3>
              <div className="snippet-list">
                {panel.chunks.map((chunk, index) => (
                  <section className="snippet-item" key={`${panel.file}-${index + 1}`}>
                    <p>Snippet {index + 1}</p>
                    <pre>
                      <code>{chunk}</code>
                    </pre>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </section>

        <aside className="guide-column">
          <article className="guide-card">
            <h2>What to prepare first</h2>
            <ul>
              {guide.prerequisites.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="guide-card">
            <h2>How to implement the pattern</h2>
            <ul>
              {guide.implementation.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>

          <article className="guide-card">
            <h2>Key points</h2>
            <ul>
              {guide.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="guide-card">
            <h2>Memory shortcut</h2>
            <p>{guide.memoryTip}</p>
          </article>

          <article className="guide-card">
            <h2>Related use case</h2>
            <p>{guide.relatedCase}</p>
          </article>

          <nav className="neighbor-nav">
            {previous ? (
              <Link href={`/patterns/${previous.slug}`}>← {previous.title}</Link>
            ) : (
              <span />
            )}
            {next ? <Link href={`/patterns/${next.slug}`}>{next.title} →</Link> : <span />}
          </nav>
        </aside>
      </div>
    </main>
  );
}
