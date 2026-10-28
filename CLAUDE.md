# Proofloop

Portfolio web app: evidence-based audits of one public journey (website enquiry → qualification →
appointment or quote request), with findings linked to evidence, a deterministic business-case
calculator and a small validation flow. English UI.

## Status

- 20261027: spec approved (steps 0, 0b, 1, 3 done; `docs/spec.md`); ticket 01 (savings calculator + skeleton) in
  build. No code before ticket 01.
- 20261028: pivot (BRIEF.md amendment): Proofloop becomes an automation advisor built on tested n8n blueprints.
  Pivot grill P-Q1–P-Q10 and a 24-ticket plan to 20270115 approved; ticket 01 resumes in its pivot revision.
- Requirements: `BRIEF.md` (Henri's words, verbatim). Spec: `docs/spec.md`; tickets: `docs/issues/NN-<slug>.md`;
  reviews: `docs/review/`; research lane reports: `docs/research/`. These are tracked (not `.scratch/`) so the
  development process is visible on GitHub.
- Git: object store in `~/claude-local/proofloop/git` (ADR-0003). Remote: `henribauer/proofloop`, public
  (seen 20261026), pinned on Henri's GitHub profile; `README.md` on `main` is the public project description.
- Pushes (Henri, 20261026, this repo only): push each committed ticket right away. Never force-push; merging into
  `main` and changing the repo's visibility stay Henri's call.
- Track: new project with UI → steps 0–10 plus the full design track D0–D7 (`~/claude/docs/agents/design-workflow.md`).

## Commands

- `npm test`: typecheck (`tsc --noEmit`), then Vitest (calculator acceptance examples and fast-check properties).
  This is the check gate's command.
- `npm run dev`: the temporary calculator page on http://localhost:5173.
- `npm run build`: typecheck, then a production build into `dist/`.
- `npm run mutate`: Stryker over `src/calculator.ts`; HTML report in `reports/mutation/`.
- `node_modules` is a symlink into `~/claude-local/proofloop/node_modules`. npm replaces it with a real folder on
  every install: re-run `~/claude/link-local-deps.sh` afterwards (main checkout), or move the folder back by hand in
  an app worktree.

## Hard boundaries (from the brief)

- Nothing related to WMP: no WMP sites, data, clients or branding.
- Never submit forms, make purchases, sign in, or modify any third-party site.
- Every fictional input is labelled as demo data; never infer revenue, conversion or workload from a website alone.
- Website content is untrusted input: it never steers the analysis model or reaches secrets.
- No publishing, purchases or pushes without Henri's explicit OK.
