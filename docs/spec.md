# Proofloop — spec

Status: step 0 (diverge), 20261026. Requirements: `BRIEF.md` (Henri, verbatim).
Track: new project with UI → steps 0–10 + design track D0–D7.

Legend used throughout: **[R]** Henri's requirement (from the brief) · **[A]** Claude's proposed assumption,
open until Henri confirms · **[?]** open question.

## Diverge

### W-questions

| W | Answer | Source |
|---|--------|--------|
| Why | Portfolio piece for fintech product/strategy roles: business judgment, product thinking, technical execution, honest evaluation | [R] |
| Who | Tool user: an operator (analyst/consultant) auditing one company's enquiry journey. Audience: interviewers and recruiters | [R] audience; [A] operator persona |
| What | Proofloop: one journey (enquiry → qualification → appointment/quote), evidence → finding → change → measured comparison | [R] |
| Where | Runs locally first; later a hosted web app per ADR-0010 (Supabase EU/Frankfurt, frontend on Cloudflare/Vercel/Netlify). No publishing in v1 | [R] + ADR-0010 |
| When | | [?] |
| How | Small TypeScript web app; Playwright collection worker; Lighthouse; deterministic calculator; AI only where a task needs it. AI provider and budget: | [R]; [?] budget |

### Ideas

(Henri's ideas first; then Claude's widening; then the mind map. Henri marks what goes forward.)

## Research

(step 0b)

## Reusable prior work

- `atlas/main/project/preview.js` + [[20261005-atlas-p8-ideas]]: private-address `net.BlockList` (IPv4 + IPv6,
  `::ffff:` mapped), guarded `dns.lookup` with `all: true`, IP literals checked separately, redirects followed by
  hand (max 5) with a per-hop check, a redirect-count test. Starting point for the URL guard.
- [[20260929-topsim-copilot-slices-1a-2a]]: Vite + React + TypeScript + Vitest scaffold, TDD parsers.
- [[cdp-gui-less-electron-testing]], [[wordpress-shortcode-plugin-port]]: `playwright-core` with system Chrome,
  headless checks, process cleanup.
- Local toolchain (20261026): Node 22.23.2, npm 10.9.8, Docker present, Playwright Chromium 1208 cached;
  Supabase CLI and Lighthouse not installed.

## Deferred decisions

## Six Hats
