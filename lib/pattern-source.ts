import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { PatternEntry } from "./pattern-data";

export type CodePanel = {
  file: string;
  chunks: string[];
};

export type PatternCodeResult = {
  panels: CodePanel[];
  message?: string;
};

const repoRoot = path.resolve(process.cwd(), "..");

async function resolveRepoPath(targetPath: string): Promise<string | null> {
  const normalized = targetPath.replace(/^\/+/, "");
  const segments = normalized.split("/").filter(Boolean);

  let current = repoRoot;
  for (const segment of segments) {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return null;
    }

    const exact = entries.find((entry) => entry.name === segment);
    const trimmed = entries.find((entry) => entry.name.trim() === segment);
    const picked = exact ?? trimmed;
    if (!picked) return null;

    current = path.join(current, picked.name);
  }

  return current;
}

async function collectPythonFiles(target: string): Promise<string[]> {
  const stat = await fs.stat(target);
  if (stat.isFile()) return target.endsWith(".py") ? [target] : [];

  const entries = await fs.readdir(target, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(target, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectPythonFiles(absolute)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".py")) files.push(absolute);
  }

  return files;
}

function splitIntoChunks(content: string): string[] {
  const normalized = content.replace(/\r\n/g, "\n");
  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.replace(/^\n+|\n+$/g, ""))
    .filter((block) => block.length > 0);

  const chunked: string[] = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    if (lines.length <= 22) {
      chunked.push(block);
      continue;
    }

    for (let index = 0; index < lines.length; index += 22) {
      chunked.push(lines.slice(index, index + 22).join("\n"));
    }
  }

  return chunked.slice(0, 12);
}

export async function getPatternCodePanels(entry: PatternEntry): Promise<PatternCodeResult> {
  const resolvedPath = await resolveRepoPath(entry.path);
  if (!resolvedPath) {
    return {
      panels: [],
      message: `Local path not found for ${entry.path}.`
    };
  }

  const files = await collectPythonFiles(resolvedPath);
  if (files.length === 0) {
    return {
      panels: [],
      message: `No .py files found under ${entry.path}.`
    };
  }

  const selectedFiles = files.slice(0, 8);
  const panels: CodePanel[] = [];

  for (const file of selectedFiles) {
    const raw = await fs.readFile(file, "utf8");
    const chunks = splitIntoChunks(raw);
    panels.push({
      file: `/${path.relative(repoRoot, file).replace(/\\/g, "/")}`,
      chunks: chunks.length > 0 ? chunks : [raw]
    });
  }

  return {
    panels,
    message:
      files.length > selectedFiles.length
        ? `Showing ${selectedFiles.length}/${files.length} files to keep this page responsive.`
        : undefined
  };
}
