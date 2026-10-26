# Step 0b lane: existing building blocks (20261026)

Lane report from a `researcher` subagent (claude-sonnet-5-5), kept as delivered. The condensed picks are in
`docs/spec.md` under `## Research`. Workspace paths below are under `/Users/henri/claude` (iCloud workspace) and
were confirmed to exist on 20261026. Searched INDEX.md, code_logs/, wiki/ and project folders; skipped WMP-related
folders, stundenerfassung and Cowork OS.

## Workspace

| Candidate (path) | What it gives us | Verdict |
|---|---|---|
| `atlas/main/project/preview.js` (known); test `atlas/test/project/preview.test.js:115` | Node-side SSRF-safe GET: BlockList, guarded `dns.lookup`, 5 manual redirects with per-hop check (l. 25–111) | Use as the fetcher behind the URL guard. Add `64:ff9b::/96`, `2002::/16` (not in l. 28–30) and a port allow-list (inference). Does not cover browser traffic (see Pitfalls) |
| topsim-copilot scaffold (known): `topsim-copilot/package.json` (vite ^7.1, vitest ^3.2, playwright-core ^1.64.0); Playwright launch with `executablePath` in `topsim-copilot/scripts/e2e-dev.ts:30` | Working TS + Vitest + Playwright setup | Use as scaffold; bump versions (Vitest latest 5.0.5) |
| Notes cdp-gui-less-electron-testing, wordpress-shortcode-plugin-port (known) | playwright-core with system Chrome | Skip; the second note is WMP-derived, do not copy its content |
| `kern/lib/rubric.js` (tests `kern/test/rubric.test.js`) | Prompt with a random-suffix tag around untrusted text (l. 34–43), JSON schema, `validate()` rejecting bad shapes (l. 65–90), `shareOut()` largest-remainder allocation (l. 50–57) | Borrow the pattern; `shareOut` divides floats, port to integer cents |
| `kern/lib/claude.js` | `ask({system,user,schema})` seam, `ModelError` | Borrow the seam only; it shells out to the CLI, swap in the Anthropic SDK |
| `Pressespiegel/pressespiegel.py:408–425`, self-test `:1764–1778`; write-up `wiki/python-document-pipeline-boundaries.md` | `fremdtext()` delimiter sanitizer, linear, with hostile test vectors | Borrow the vectors, port to TS; skip the Python code |
| `wiki/model-batch-validation-before-persistence.md`, `code_logs/20261011-kern-ticket-03-digest.md:73–75` | Validate the whole model answer against what was sent (IDs, duplicates) before saving; delimiters alone do not stop prompt injection | Borrow for the "finding must link to real evidence" check |
| `trading-app/src/trading_app/versuchsregister.py`, `statistik.py:91–121` | Hypothesis declared before the run, no delete path; Wilson interval plus minimum-n display rule | Borrow the design for the validation flow; rewrite in TS (Wilson ≈ 8 lines) |
| `trading-app/docs/20260924_trading-app-qualitaetsstandards.md` §1.1, §2.2, §2.4; README l. 144–159 | Dependency audit protocol, 4 test layers (reference values, invariants, mutation), "web content is data, not instructions" (l. 47), Decimal-only money | Borrow as process; the tax engine is spec only, skip code |
| `atlas/core/design/color.js`, `atlas/test/design/contrast.test.js` | WCAG luminance maths and a data-driven contrast gate over CSS tokens | Borrow for the token contrast test |
| `wiki/docker-desktop-local-n8n.md`, `code_logs/20261019-n8n-docker-install.md` | n8n 2.43.8 on loopback 5678, data in `~/claude-local/n8n` (reported, not rechecked) | Use as the import-test target |
| `docs/adr/0010-publish-as-a-web-app-on-supabase.md` | Hosting decision: Supabase EU, RLS, secrets in Edge Functions, manifest + apple-touch-icon | Use as constraint. No Supabase, PWA, Lighthouse, axe, zod, promptfoo or TS chart code exists anywhere in the workspace |
| `atlas/main/project/share.js` (Electron printToPDF), `wiki/pymupdf-chart-engine.md` (Python) | PDF and chart code | Skip, wrong runtime |

## Open source and APIs

Versions checked 20261026 via GitHub/npm APIs.

| Candidate | Gives us | Licence / cost | Maturity | Verdict | Source |
|---|---|---|---|---|---|
| Playwright (+ `route`, `page.pdf`) | Screenshots, text, request blocking, PDF | Apache-2.0 | 1.64.1, 20261014 | Use | [repo](https://github.com/microsoft/playwright), [network](https://playwright.dev/docs/network) |
| Lighthouse | Lab performance score | Apache-2.0; Node ≥22.19 | 13.5.0, 20260918 | Use for performance only, median of 5 runs; no official Docker image, run inside the Playwright image (unverified) | [npm](https://registry.npmjs.org/lighthouse/latest) |
| CrUX API (+ PSI API) | Public field data without Chromium: free with key, 150 queries/min, 28-day data, URL or origin | Free | PSI docs: "we plan to discontinue" CrUX data in PSI; PSI lab = Lighthouse 13.0 (20251020) | Use CrUX directly; PSI optional fallback for lab data | [CrUX](https://developer.chrome.com/docs/crux/api), [PSI](https://developers.google.com/speed/docs/insights/v5/get-started) |
| axe-core + @axe-core/playwright | Accessibility violations on the already-guarded page | MPL-2.0 | 4.14.0, 20261005 | Use instead of Lighthouse's accessibility category (one navigation, one guard point; judgment) | [repo](https://github.com/dequelabs/axe-core) |
| @mozilla/readability | Article extraction | Apache-2.0 | 0.6.0, 20250303 | Skip: `_prepArticle` removes input, textarea, select, button, footer, aside, which this audit needs | [source](https://raw.githubusercontent.com/mozilla/readability/main/Readability.js) |
| request-filtering-agent / ssrf-req-filter | Agent-level private-IP block | MIT / MIT | 3.2.1, 20260629 / 1.1.1, 20240511 | Skip: Node http agents only, advisories (see Pitfalls); Atlas `preview.js` covers this | [rfa](https://github.com/azu/request-filtering-agent), [srf](https://github.com/y-mehta/ssrf-req-filter) |
| Smokescreen (Stripe) | Egress proxy that resolves DNS itself and blocks private ranges | MIT | "latest" tag v0.1.0, 20260921 (looks odd, unverified) | Borrow later: clean fix for browser DNS rebinding, adds a Go service | [repo](https://github.com/stripe/smokescreen) |
| robots-parser | robots.txt check | MIT | 3.0.1, 20230221 | Borrow, optional courtesy check | [npm](https://registry.npmjs.org/robots-parser) |
| Recharts (+ shadcn chart) | Bar charts; waterfall = stacked bar with invisible base (no official example found) | MIT | 3.10.1, 20260725 | Use; always add an HTML table | [repo](https://github.com/recharts/recharts) |
| Observable Plot; Chart.js; visx | Overlapping chart libs | ISC; MIT; MIT | 0.6.17, 20250214; 4.6.1, 20261022; 4.0.0, 20260611 | Skip: Chart.js is canvas (manual fallback text); Plot has no documented keyboard support; visx is low-level | [chart.js a11y](https://www.chartjs.org/docs/latest/general/accessibility.html), [plot](https://observablehq.com/plot) |
| shadcn/ui (copy-in) on Radix, Base UI or React Aria | Accessible components | MIT; CLI 4.22.1, 20261018; React Aria Components 1.22.0 (Apache-2.0) | Active | Use; pick one base | [changelog](https://ui.shadcn.com/docs/changelog) |
| PDF: Playwright `page.pdf` vs @react-pdf/renderer | One-page report | Apache-2.0 / MIT (4.9.0) | `tagged` and `outline` options exist (default false); react-pdf has an open WCAG/tagging issue (20250624) | Use `page.pdf({tagged:true})`; skip react-pdf | [page.pdf](https://playwright.dev/docs/api/class-page) |
| n8n (+ JSON import, templates) | Import by UI file, `n8n import:workflow --input=f.json` (Docker: `docker exec -u node`), or REST API | Sustainable Use License (fair-code, not OSI) | 2.44.7, 20261026 (local 2.43.8) | Use for the demo; do not host n8n for third parties. Templates: borrow ideas only (no licence stated) | [cli](https://docs.n8n.io/hosting/cli-commands/), [licence](https://github.com/n8n-io/n8n/blob/master/LICENSE.md) |
| decimal.js (or integer cents) | Exact division, per-clone rounding | MIT | 10.6.0, 20250706 | Use decimal.js + integer cents for storage; skip big.js (overlap) | [npm](https://registry.npmjs.org/decimal.js) |
| simple-statistics | Mean, median, etc. | ISC | 7.12.1, 20260927 | Skip: trivial maths | [repo](https://github.com/simple-statistics/simple-statistics) |
| Zod 4 + @anthropic-ai/sdk | `zodOutputFormat()`, `messages.parse()`; structured outputs GA | MIT; Apache-2.0 | 4.6.7, 20261012; 1.3.0, 20261023 | Use | [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) |
| promptfoo | Evals with `is-json`/`javascript` asserts; red-team `indirect-prompt-injection` plugin | MIT (README: now part of OpenAI, stays MIT; secondary sources only) | 0.125.1, 20261025; Node ≥22.22 | Use for the benchmark | [plugin](https://www.promptfoo.dev/docs/red-team/plugins/indirect-prompt-injection/) |
| fast-check + StrykerJS (+ Vitest 5.0.5) | Property and mutation tests for the calculator | MIT; Apache-2.0 | 4.10.2, 20260919; 10.1.1, 20261023 | Use (matches the workspace "mutation-tested" rule) | [stryker](https://registry.npmjs.org/@stryker-mutator/vitest-runner/latest) |
| Supabase CLI; vite-plugin-pwa | Later hosting; PWA plugin | MIT (2.122.0, 20261023); MIT (2.0.0) | Active | Defer both; ADR-0010 needs only a manifest | [limits](https://supabase.com/docs/guides/functions/limits) |

## Pitfalls

- **Browser DNS re-resolution (TOCTOU).** Open WebUI checked the host in Python, then Playwright resolved it again:
  CVE-2026-87996, published 20260910 (secondary write-up). The fix fetches through a guarded client and hands the
  bytes to the browser. [securelayer7](https://securelayer7.net/lab/cve-2026-87996-open-webui-playwright-dns-rebinding-ssrf)
- **Route interception has gaps.** Redirects after the first request are not re-intercepted; service workers hide
  requests (set `serviceWorkers: 'block'`). [network](https://playwright.dev/docs/network). Playwright 1.64.1 fixed a
  regression where any registered route aborts a preflighted cross-origin redirect on Chromium 155+.
  [release](https://github.com/microsoft/playwright/releases/tag/v1.64.1)
- **Design that follows.** Route every request through our own guarded fetch, follow redirects ourselves, and
  `route.fulfill` the bytes. Chromium bypasses a proxy for localhost and link-local by default (secondary source).
  OWASP: deny-lists are bypass-prone; connect only to a validated IP; firewall egress. Add sentinel-server tests.
  Proxying every subrequest through Node distorts load timing (inference), so take performance from Lighthouse,
  CrUX or PSI instead.
- **SSRF libraries.** request-filtering-agent: GHSA-pw25-c82r-75mm (v1.x, HTTPS to 127.0.0.1 not blocked,
  CVE-2025-57814, fixed in 2.0.0) and GHSA-r3r9-wp5j-pq5g (≤3.2.0, synchronous throw crashes the process; fix in 3.2.1
  inferred); no support for Node's built-in `fetch`. ssrf-req-filter is unprotected with a custom `lookup` and has
  had no release since 20240511. [advisories](https://github.com/azu/request-filtering-agent/security/advisories)
- **Lighthouse and Chromium setup.** A single run is noisy (median of 5 is "twice as stable"; wants ≥2 dedicated
  cores). [variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md). Lighthouse
  navigates by itself, so a Playwright route guard does not apply (inference). Playwright 1.64.1 expects Chromium
  revision 1248; the local cache holds 1208 → `npx playwright install chromium` or set `executablePath`. The
  Playwright Docker image is "for testing and development only"; for untrusted sites run as `pwuser` with a seccomp
  profile. [docker](https://playwright.dev/docs/docker)
- **Chart accessibility.** Recharts' `accessibilityLayer` misbehaves with macOS VoiceOver (QuickNav must be off) and
  does not work for vertical layouts; the table fallback is mandatory.
  [discussion](https://github.com/recharts/recharts/discussions/4662)
- **Structured outputs do not enforce limits.** The API rejects `minimum`/`maximum`, `minLength`/`maxLength` and
  `maxItems` (only `minItems` 0 or 1). Refusal or `max_tokens` replies may not match the schema. "At most 3
  findings" and evidence linkage need Zod plus our own checks.
  [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- **Smaller traps.** Supabase Edge Functions: 2 s CPU, 256 MB, so Chromium and PDF need a separate worker. n8n
  `import:workflow` deactivates workflows, overwrites on ID clash, exports hold credential names, and the server CLI
  is slated for deprecation (no date) ([cli](https://docs.n8n.io/hosting/cli-commands/)). promptfoo red-team
  generation is remote by default: set `PROMPTFOO_DISABLE_REDTEAM_REMOTE_GENERATION=true`
  ([config](https://www.promptfoo.dev/docs/red-team/configuration/)).

## Could not verify

Lighthouse Docker guidance (no official source); Chromium `--host-resolver-rules` as defence-in-depth (idea only);
the `page.pdf` "headless Chromium only" note; release dates for radix-ui, @react-pdf/renderer, Vitest and
vite-plugin-pwa; the local n8n state.
