# Python Design Patterns Visualizer (Next.js)

## Run locally

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

## Sync content to DB

```bash
cd web
DATABASE_URL=postgres://user:pass@localhost:5432/your_db npm run sync:content
```

Optional force re-sync:

```bash
cd web
DATABASE_URL=postgres://user:pass@localhost:5432/your_db npm run sync:content -- --force
```

This command reads `lib/pattern-data.ts` and `lib/problem-slides.ts`, then incrementally upserts into:

- `chatbot_documents`
- `chatbot_sync_state`

## What this page shows

- Full course deck for all patterns listed in root `README.md` (same order)
- Learning flow from easier to harder lessons
- Single-page course deck with section navigation
- Each pattern includes:
  - Problem -> Pain -> Solution
  - Pattern recognition cues
  - Coupling analysis (before/after)
  - Naive implementation vs refactor with pattern
  - UML evolution by development-thinking stages with rendered graph cards
  - Pattern vs no-pattern comparison
  - Real-life analogy
- Top hamburger menu opens navigation for every problem/pattern
- EN/VI language toggle
- Pattern detail pages still include local code snippets and implementation notes
