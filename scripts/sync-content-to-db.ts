import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { Client } from "pg";
import {
  deckText,
  pickList,
  pickText,
  problemLessons,
  type Lang,
  type ProblemLesson
} from "../lib/problem-slides";
import { patternEntries, sections, slugify, type PatternEntry, type PatternSection } from "../lib/pattern-data";

type SourceId = "pattern-data" | "problem-slides";

type SyncDocumentInput = {
  id: string;
  sourceId: SourceId;
  sourcePath: string;
  docType: string;
  slug: string | null;
  lang: Lang | null;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
};

type SyncDocument = SyncDocumentInput & {
  contentHash: string;
};

type SourceDefinition = {
  sourceId: SourceId;
  sourcePath: string;
  buildDocuments: () => SyncDocument[];
};

type SourceSyncResult = {
  sourceId: SourceId;
  skipped: boolean;
  docs: number;
  inserted: number;
  updated: number;
  unchanged: number;
  deleted: number;
};

const SYNC_SCHEMA_VERSION = "v1";
const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), "..");
const forceSync = process.argv.includes("--force");

function hashText(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function toBulletedList(lines: string[]): string {
  return lines.map((line) => `- ${line}`).join("\n");
}

function toSyncDocument(input: SyncDocumentInput): SyncDocument {
  const contentHash = hashText(
    JSON.stringify({
      docType: input.docType,
      slug: input.slug,
      lang: input.lang,
      title: input.title,
      content: input.content,
      metadata: input.metadata
    })
  );
  return { ...input, contentHash };
}

function buildSectionDocument(section: PatternSection): SyncDocument {
  const id = `section:${slugify(section.title)}`;
  const patternList = section.items.map((item) => `- ${item.title} (${item.path})`).join("\n");
  return toSyncDocument({
    id,
    sourceId: "pattern-data",
    sourcePath: "lib/pattern-data.ts",
    docType: "section",
    slug: slugify(section.title),
    lang: "en",
    title: section.title,
    content: [`Section: ${section.title}`, `Accent: ${section.accent}`, "Patterns:", patternList].join("\n"),
    metadata: {
      accent: section.accent,
      itemCount: section.items.length
    }
  });
}

function buildPatternDocument(entry: PatternEntry): SyncDocument {
  return toSyncDocument({
    id: `pattern:${entry.slug}`,
    sourceId: "pattern-data",
    sourcePath: "lib/pattern-data.ts",
    docType: "pattern",
    slug: entry.slug,
    lang: "en",
    title: entry.title,
    content: [
      `Pattern: ${entry.title}`,
      `Section: ${entry.sectionTitle}`,
      `Path: ${entry.path}`,
      "Key points:",
      toBulletedList(entry.points)
    ].join("\n"),
    metadata: {
      sectionTitle: entry.sectionTitle,
      sectionAccent: entry.sectionAccent,
      sectionIndex: entry.sectionIndex,
      itemIndex: entry.itemIndex,
      path: entry.path
    }
  });
}

function buildPatternDocs(): SyncDocument[] {
  return [...sections.map(buildSectionDocument), ...patternEntries.map(buildPatternDocument)];
}

function buildLessonText(lesson: ProblemLesson, lang: Lang): string {
  const painBlocks = lesson.painBlocks
    .map(
      (block) =>
        [`${pickText(block.heading, lang)}:`, toBulletedList(pickList(block.details, lang))].join("\n")
    )
    .join("\n\n");

  const comparisonRows = lesson.comparison
    .map(
      (row) =>
        `- ${pickText(row.aspect, lang)} | no-pattern: ${pickText(row.noPattern, lang)} | with-pattern: ${pickText(row.withPattern, lang)}`
    )
    .join("\n");

  const umlStages = lesson.umlStages
    .map((stage) => `${pickText(stage.title, lang)}: ${pickText(stage.thinking, lang)}`)
    .join("\n");

  const recognitionCues = lesson.recognitionCues
    .map((cue) => {
      const codeIndented = cue.code
        .split("\n")
        .map((line) => `    ${line}`)
        .join("\n");

      return [
        `- ${pickText(cue.cue, lang)}`,
        "  Code:",
        codeIndented,
        `  Explanation: ${pickText(cue.explanation, lang)}`
      ].join("\n");
    })
    .join("\n");

  return [
    `Pattern: ${lesson.title}`,
    `Lesson order: ${lesson.order}`,
    `Business problem: ${pickText(lesson.businessProblem, lang)}`,
    `Team: ${pickText(lesson.team, lang)}`,
    `Problem label: ${pickText(lesson.problemLabel, lang)}`,
    `Section: ${pickText(lesson.section, lang)}`,
    `Difficulty: ${pickText(lesson.difficulty, lang)}`,
    `Context: ${pickText(lesson.context, lang)}`,
    `Architectural goal: ${pickText(lesson.architecturalGoal, lang)}`,
    "",
    "Problem:",
    pickText(lesson.problem, lang),
    "",
    "Problem narrative:",
    toBulletedList(pickList(lesson.problemNarrative, lang)),
    "",
    "Pain:",
    toBulletedList(pickList(lesson.pain, lang)),
    "",
    "Pain blocks:",
    painBlocks,
    "",
    "Solution:",
    toBulletedList(pickList(lesson.solution, lang)),
    "",
    "Recognition cues:",
    recognitionCues,
    "",
    "Coupling:",
    `- Before: ${pickText(lesson.coupling.before, lang)}`,
    `- After: ${pickText(lesson.coupling.after, lang)}`,
    "Coupling insights:",
    toBulletedList(pickList(lesson.coupling.insights, lang)),
    "",
    "Coupling diagram before:",
    lesson.couplingDiagramBefore,
    "",
    "Coupling diagram after:",
    lesson.couplingDiagramAfter,
    "",
    "Naive code:",
    lesson.naiveCode,
    "",
    "Pattern code:",
    lesson.patternCode,
    "",
    "Pattern code commentary:",
    toBulletedList(pickList(lesson.patternCodeCommentary, lang)),
    "",
    "UML stages:",
    umlStages,
    "",
    "Comparison:",
    comparisonRows,
    "",
    "Analogy:",
    pickText(lesson.analogy, lang),
    "",
    "Strategic outcome:",
    toBulletedList(pickList(lesson.strategicOutcome, lang)),
    "",
    "Core insight:",
    pickText(lesson.coreInsight, lang)
  ].join("\n");
}

function buildLessonDocuments(lesson: ProblemLesson): SyncDocument[] {
  const langs: Lang[] = ["en", "vi"];
  return langs.map((lang) =>
    toSyncDocument({
      id: `lesson:${lesson.id}:${lang}`,
      sourceId: "problem-slides",
      sourcePath: "lib/problem-slides.ts",
      docType: "lesson",
      slug: lesson.id,
      lang,
      title: `${lesson.title} (${lang})`,
      content: buildLessonText(lesson, lang),
      metadata: {
        order: lesson.order,
        patternTitle: lesson.title,
        section: pickText(lesson.section, lang)
      }
    })
  );
}

function buildDeckTextDocuments(): SyncDocument[] {
  const langs: Lang[] = ["en", "vi"];
  return langs.map((lang) => {
    const values = deckText[lang];
    const content = Object.entries(values)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    return toSyncDocument({
      id: `deck-text:${lang}`,
      sourceId: "problem-slides",
      sourcePath: "lib/problem-slides.ts",
      docType: "deck-text",
      slug: `deck-text-${lang}`,
      lang,
      title: `Deck text (${lang})`,
      content,
      metadata: {
        keys: Object.keys(values).length
      }
    });
  });
}

function buildProblemDocs(): SyncDocument[] {
  return [...problemLessons.flatMap(buildLessonDocuments), ...buildDeckTextDocuments()];
}

const sourceDefinitions: SourceDefinition[] = [
  {
    sourceId: "pattern-data",
    sourcePath: "lib/pattern-data.ts",
    buildDocuments: buildPatternDocs
  },
  {
    sourceId: "problem-slides",
    sourcePath: "lib/problem-slides.ts",
    buildDocuments: buildProblemDocs
  }
];

async function ensureTables(client: Client): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS chatbot_documents (
      id TEXT PRIMARY KEY,
      source_id TEXT NOT NULL,
      source_path TEXT NOT NULL,
      doc_type TEXT NOT NULL,
      slug TEXT,
      lang TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      content_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_chatbot_documents_source_id
      ON chatbot_documents (source_id);
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_chatbot_documents_doc_type
      ON chatbot_documents (doc_type);
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_chatbot_documents_slug
      ON chatbot_documents (slug);
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS chatbot_sync_state (
      source_id TEXT PRIMARY KEY,
      source_path TEXT NOT NULL,
      source_hash TEXT NOT NULL,
      doc_count INTEGER NOT NULL,
      synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getCurrentSourceHash(client: Client, sourceId: SourceId): Promise<string | null> {
  const result = await client.query<{ source_hash: string }>(
    `SELECT source_hash FROM chatbot_sync_state WHERE source_id = $1 LIMIT 1`,
    [sourceId]
  );
  return result.rows[0]?.source_hash ?? null;
}

async function syncOneSource(client: Client, source: SourceDefinition): Promise<SourceSyncResult> {
  const absoluteSourcePath = path.join(projectRoot, source.sourcePath);
  const sourceContent = await fs.readFile(absoluteSourcePath, "utf8");
  const sourceHash = hashText([SYNC_SCHEMA_VERSION, sourceContent].join(":"));
  const previousSourceHash = await getCurrentSourceHash(client, source.sourceId);

  if (!forceSync && previousSourceHash === sourceHash) {
    return {
      sourceId: source.sourceId,
      skipped: true,
      docs: 0,
      inserted: 0,
      updated: 0,
      unchanged: 0,
      deleted: 0
    };
  }

  const documents = source.buildDocuments();
  const docIds = documents.map((document) => document.id);
  let inserted = 0;
  let updated = 0;
  let unchanged = 0;

  for (const document of documents) {
    const result = await client.query<{ inserted: boolean }>(
      `
        INSERT INTO chatbot_documents (
          id, source_id, source_path, doc_type, slug, lang, title, content, metadata, content_hash, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, NOW())
        ON CONFLICT (id) DO UPDATE
          SET source_id = EXCLUDED.source_id,
              source_path = EXCLUDED.source_path,
              doc_type = EXCLUDED.doc_type,
              slug = EXCLUDED.slug,
              lang = EXCLUDED.lang,
              title = EXCLUDED.title,
              content = EXCLUDED.content,
              metadata = EXCLUDED.metadata,
              content_hash = EXCLUDED.content_hash,
              updated_at = NOW()
          WHERE chatbot_documents.content_hash IS DISTINCT FROM EXCLUDED.content_hash
        RETURNING (xmax = 0) AS inserted;
      `,
      [
        document.id,
        document.sourceId,
        document.sourcePath,
        document.docType,
        document.slug,
        document.lang,
        document.title,
        document.content,
        JSON.stringify(document.metadata),
        document.contentHash
      ]
    );

    if (result.rowCount === 0) {
      unchanged += 1;
      continue;
    }
    if (result.rows[0]?.inserted) {
      inserted += 1;
    } else {
      updated += 1;
    }
  }

  const deleteResult = await client.query(
    `
      DELETE FROM chatbot_documents
      WHERE source_id = $1
        AND NOT (id = ANY($2::text[]));
    `,
    [source.sourceId, docIds]
  );

  await client.query(
    `
      INSERT INTO chatbot_sync_state (source_id, source_path, source_hash, doc_count, synced_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (source_id) DO UPDATE
        SET source_path = EXCLUDED.source_path,
            source_hash = EXCLUDED.source_hash,
            doc_count = EXCLUDED.doc_count,
            synced_at = NOW();
    `,
    [source.sourceId, source.sourcePath, sourceHash, documents.length]
  );

  return {
    sourceId: source.sourceId,
    skipped: false,
    docs: documents.length,
    inserted,
    updated,
    unchanged,
    deleted: deleteResult.rowCount ?? 0
  };
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL. Example: DATABASE_URL=postgres://user:pass@localhost:5432/db");
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await ensureTables(client);
    const results: SourceSyncResult[] = [];

    for (const source of sourceDefinitions) {
      await client.query("BEGIN");
      try {
        const result = await syncOneSource(client, source);
        results.push(result);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    for (const result of results) {
      if (result.skipped) {
        console.log(`[${result.sourceId}] skipped (source hash unchanged)`);
        continue;
      }
      console.log(
        `[${result.sourceId}] docs=${result.docs} inserted=${result.inserted} updated=${result.updated} unchanged=${result.unchanged} deleted=${result.deleted}`
      );
    }
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
