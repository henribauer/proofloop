# Proofloop — spec

Status: **pivot plan approved (Henri, 20261028: "feels right", OK for the plan and changes 1–3).** Spec approved
20261027, then Henri amended the brief toward automation advice with n8n; ticket 01 resumes with its pivot
revision. The pivot grill is settled; v1 scope, Tickets and Six Hats are rewritten for it; the Diverge, Research and Grill sections stay as the
dated record. Requirements: `BRIEF.md` (Henri, verbatim, with the 20261028 amendment).
Track: new project with UI → steps 0–10 + design track D0–D7.
Ticket 01 (20261028): built on `auto/v1` (calculator, tests, skeleton, plain page), in review and handoff to Henri.

Legend used throughout: **[R]** Henri's requirement (from the brief) · **[A]** Claude's proposed assumption,
open until Henri confirms · **[?]** open question.

## Pivot (20261028)

Amendment (BRIEF.md): Proofloop focuses on optimising companies with automation platforms like n8n: what can be
automated, how, and which tools are needed. Restated: Proofloop becomes an automation advisor that shows which tasks
can be automated, how (an importable n8n workflow), with which tools, and when it pays off; honest evidence labels
and break-even stay. Fact research for the pivot runs as a workflow; results go to `docs/research/pivot-*.md`.

### Pivot decisions

- **P-Q1 Where Proofloop learns how a company works** (20261028): a structured company intake plus the website.
  The company (in the demo: the fictional broker) supplies its process (steps, volume per month, time per step,
  tools used); Proofloop adds what the public website shows (incl. tools it already embeds). Every fact is labelled
  "observed on the website" or "supplied by the company".
- **P-Q2 Which processes** (20261028): v1 covers one process in depth: an enquiry from arrival to booked appointment,
  with all internal steps (capture, CRM contact and duplicate check, qualification, document request, slot
  proposal, confirmation and reminders, advisor handover, follow-up). The fully developed product covers any process
  a company names (Henri: "B later"), so the intake and data model are process-agnostic from the start (steps,
  volume, time per step, tools, all per process) and the calculator counts "cases per month", shown as "enquiries"
  for this process. No rebuild needed to add processes later.
- **P-Q3 Where the n8n workflows come from** (20261028): v1 recommends only tested blueprints: about 5–8 building
  blocks for the enquiry process, each built and run in the local n8n; Proofloop picks the blocks that fit the intake
  and fills in the company's tools. Later, for "any process": AI-drafted workflows may fill gaps, always labelled
  "untested draft, check before use" and never presented as a recommendation.
  _Narrowed for v1 to one tested tool per block (v1 scope, change 3; Henri OK 20261028)._
- **P-Q4 Which tools** (20261028): build on what the company already has (named in the intake or detected on the
  website) and only fill gaps from a short vetted list. A listed tool needs an official n8n integration, a way to
  keep data in the EU, and a published price; its monthly cost flows into the break-even. No affiliate links or paid
  placements.
- **P-Q5 Website audit in v1** (20261028): cut down to what serves automation: the enquiry entry point (form fields,
  booking tool, stated response times), tool detection (embedded form, booking, chat, CRM tools), and accessibility
  checks on the enquiry form only. No speed measurements (Lighthouse, CrUX) in v1. URL guard, personal-data stripping
  and hostile-content protection stay in full.
  Henri's direction for the full product (20261028, his words: "the audit should be for whole companies, first on a
  small scale and then getting bigger, and also websites"): Proofloop grows into an audit of whole companies,
  website included. What "small scale, then bigger" refers to is P-Q6.
- **P-Q6 What grows** (20261028): both, in this order. First the audit grows within small businesses (one process →
  more processes → the whole small company plus its website); then larger companies, which need other methods
  (interviews, system data, stricter data protection) and come as a later phase. v1 is the first step: one process,
  tested and measured, built to grow into a whole-company audit.
- **P-Q7 Which tools count as connectable** (20261028; replaces P-Q4's "official n8n integration" condition): a
  tiered rule, shown on every tool. Tier 1 built-in n8n node (preferred); tier 2 community node verified by n8n;
  tier 3 n8n HTTP Request against a documented API, the request built into the tested blueprint; tier 4 no API:
  "not automatable with n8n", stays manual or a tool switch is offered with its cost in the break-even. Unverified
  community nodes are never recommended (third-party code inside the company's n8n). P-Q4's other conditions stay:
  EU data option, published price, no affiliate links.
- **P-Q8 What automation may decide** (20261028): automation sorts and prepares, a person decides. Blueprints check
  completeness, flag missing documents, mark "probably outside our offer" and route to the right advisor queue;
  every decision that affects the customer (reject, turn away, put on hold) is made by a person before any email
  goes out (GDPR Art. 22; CJEU SCHUFA). Proofloop flags this risk when an intake describes automatic rejection. The
  person's review time counts in the break-even as minutes not saved.
- **P-Q9 AI steps in the company's blueprints** (20261028): rules first, wherever form fields allow; free text that
  rules cannot sort goes to a person. An AI sorting block exists only as an optional building block that runs after a
  step removing names, contact details and health information. The brief's AI-versus-rules test runs on the
  fictional broker's enquiries with Claude (no real data). An EU-hosted model is a later research topic.
- **P-Q10 Who fills in the intake** (20261028): v1 is an advisor's tool. Henri fills in the intake in a
  conversation with the company; the company supplies the "last 10 cases" table itself. Everything stays on his
  machine, with no login or online storage for outsiders. A self-service link for companies is the step after v1.

### Pivot conventions [A] (Claude's defaults, open to Henri's veto)

- **"Tested blueprint"** = runs end to end in a pinned n8n version (recorded per blueprint) against local mock
  services (no sign-ins to real vendor accounts; each blueprint records what its mocks stand in for), with a
  recorded test run (input, output, execution log); every node that writes to a customer is unreachable without the
  human-approval step, except confirmation and reminder mail for an appointment the enquirer booked themselves (the
  blueprint's test enforces this list); every Webhook or resume trigger has authentication other than None; exported JSON passes a check that fails on credential names and IDs and on secret-like values
  in node parameters (auth headers, tokens in URLs, webhook secrets); re-tested when the n8n version changes.
  (Narrowed 20261028 by the plan's critic pass: the first version allowed test accounts.)
- **Intake** = per-criterion ratings after PCEF (each answer a number, a choice or "don't know", each with its
  provenance label), gate order eligibility → potential → relevance, a SIPOC of 4–5 steps, and the "last 10 cases"
  table instead of "minutes per enquiry". Provenance (P-Q1): "supplied by the company" is the calculator's
  `company-supplied`; "observed on the website" tags ticket 11's signals; both show next to the finding labels
  (fact / hypothesis / estimate / measured).
- **Tier per action** (P-Q7): a built-in node counts as tier 1 only for the actions it offers; a trigger-only node
  (Calendly, Cal.com, Typeform, Jotform) is tier 1 for its trigger and tier 3 (HTTP Request) for its actions.
- **Calculator** counts cases per month; running cost = the recommended tools' monthly prices + n8n hosting; setup
  cost = setup hours × rate + one-off fees. Ticket 01's paused work is kept and adapted, not redone.
- **Measured labels:** below N=20, results read "measured, descriptive (N=…)", never as statistics.

### Pivot research (20261028)

Workflow: four `researcher` lanes (claude-sonnet-5-5), each re-checked by an independent skeptic, plus a
completeness critic. Reports: `docs/research/pivot-assessment.md`, `pivot-n8n.md`, `pivot-prior-art.md`,
`pivot-website-signals.md`, `pivot-critic.md`. Of 40 key claims, 29 confirmed, 10 partly (details corrected),
1 unverifiable, 0 refuted. Findings that reopen or add decisions:

1. **The P-Q4 tool gate is too strict.** n8n has no built-in node for Lexware Office, sevDesk, DATEV, DocuSign,
   Tally or Google Forms (community nodes exist for some; the HTTP Request node can call documented APIs).
   Calendly, Cal.com, Typeform and Jotform are trigger-only. "Official integration" would empty the German
   finance-tool list → redefine the gate as levels (P-Q7).
2. **Automated qualification can be an automated decision under GDPR Art. 22**; the CJEU SCHUFA ruling (C-634/21)
   treats a score a decision "draws strongly" on as such (judgment text not reached; secondary sources agree). A
   blueprint that rejects enquiries on income rules is a legal risk → rule needed (P-Q8).
3. **No EU route for Claude** (re-confirmed), and insurance enquiries can contain health data (Art. 9). Blueprints
   with an AI step that companies run on real customer data need an EU-capable model or no personal data → open.
4. **n8n licence grey zone:** pushing workflows into a client's n8n, or building them for outsiders with an AI agent,
   is not clearly covered; nobody has asked license@n8n.io → Henri may want to ask before "any process" with AI drafts.
5. **"Tested" needs a definition:** a pinned n8n version (local 2.43.8; newer stable releases exist, a 3.0
   pre-release changes imports) and test accounts or mocks for Gmail, CRM, Lexware.
6. **Measurement:** n8n Insights shows executions, failures and run time, but its "time saved" is self-entered, not
   measured. With 6–10 testers, results are "measured, descriptive (N=…)", not statistics.
7. **Assessment method to borrow:** rate each suitability criterion separately (no composite score), gate order
   eligibility → potential → relevance (PCEF, CC BY 4.0); ask for "the last 10 cases" instead of "minutes per
   enquiry" to cut self-report bias.
8. **Prior art:** process and task mining (Celonis, UiPath, Power Automate) need system logs or desktop recordings;
   Zapier/Make/n8n AI builders generate workflows from a prompt without assessing the business. Free German
   Mittelstand-Digital checks exist. Proofloop's honest gap: evidence-labelled assessment + tested blueprint +
   break-even + measured result, not a new category.
9. **Demo domain rules not yet researched:** broker regulation (§34d GewO, IDD) and UWG §7 consent for follow-up
   emails.

## Diverge

### W-questions

| W | Answer | Source |
|---|--------|--------|
| Why | Portfolio piece for fintech product/strategy roles: business judgment, product thinking, technical execution, honest evaluation | [R] |
| Who | Tool user: an operator (analyst/consultant) auditing one company's enquiry journey. Audience: interviewers and recruiters | [R] audience; [A] operator persona |
| What | Proofloop: one journey (enquiry → qualification → appointment/quote), evidence → finding → change → measured comparison | [R] |
| Where | Runs locally first; later a hosted web app per ADR-0010 (Supabase EU/Frankfurt, frontend on Cloudflare/Vercel/Netlify). No publishing in v1 | [R] + ADR-0010 |
| When | First complete version by 20270115 at the latest (~11.5 weeks from 20261026) | Henri, 20261026 |
| How | Small TypeScript web app; Playwright collection worker; Lighthouse; deterministic calculator; AI only where a task needs it. AI: Claude API behind a monthly spend cap, either as direct calls or as an own agent built on the Claude Agent SDK | [R]; Henri, 20261026 (AI); [?] cap amount, API vs SDK |

### Ideas

Henri, 20261026 (verbatim):

> it should be visually appealing with graphs and so on, easy interface and with reports that can be downloaded
> for the companies. Perhaps we could also work with n8n and base the project on it, as many companies use it so
> we tell them what they need to setup in n8n or similar programs. everthing should be visually appealing but dont
> hinder the function of the product. it should only suggest things that would really work and not things that
> may fail because they are too complicated (better safe then sorry). It's also important that it shows what sort
> of savings can be made; that's usually the most important thing

### Mind map

1–5 are Henri's ideas, each with one variant from Claude. 6–8 are new ones from Claude.
**Going forward (Henri, 20261026): all eight, 1–8.** The grill works from all of them; the [A] readings under 3
and 4 stay open until it confirms them.

- **1 Visually appealing, easy, function first** (Henri)
  - Variant: every chart answers one question and has a table beside it, so there are no decorative charts.
    Candidates: a savings waterfall, the before/after test result, evidence coverage per page.
- **2 Downloadable reports for companies** (Henri)
  - Variant: a one-page decision memo per finding (observation, evidence screenshot, savings scenario with its
    inputs, test plan), made with the browser's own print-to-PDF. Every number in it traces to an input or an
    evidence ID.
- **3 n8n** (Henri)
  - [A] Reading: Proofloop itself stays a small TypeScript web app (brief). n8n is what it recommends, and what
    the demo's improvement is built with.
  - Variant: each automation finding comes with a setup recipe: plain steps, prerequisites, running cost, and an
    importable n8n workflow file (n8n workflows are JSON). The demo's improvement runs on that same file, so the
    recipe is proven rather than just suggested. "Or similar programs" (Make, Zapier, Power Automate) get the
    plain steps only.
- **4 Only suggest what will really work** (Henri)
  - Variant: a simplest-fix ladder per finding (no change → UX fix → rules → integration → AI) that stops at the
    first rung that works. Each finding shows setup effort and what can break; anything above medium effort is
    flagged, not recommended.
  - [?] Tension with the brief: whether a change works is only known after a test, and the brief wants the demo to
    include a recommendation that failed. [A] Reading: suggest only simple, low-risk changes, and still report
    honestly when one did not work.
- **5 Show the savings, front and centre** (Henri)
  - Variant: lead with break-even instead of a savings claim ("pays off from N enquiries a month"), then hours
    released net of review time and tool costs, as low / expected / high.
  - Brief limits stay: hours released are not cash saved, savings come only from visible, labelled inputs, never
    from the website alone.
- **New (Claude)**
  - **6 Reverse the problem: a "don't buy this" verdict.** Proofloop also says when a tool or AI costs more than
    it saves, e.g. a chatbot versus fixing the FAQ.
  - **7 Drop an assumption (only demo numbers exist): company-supplied inputs.** A short form where the company
    enters its own numbers (enquiries a month, minutes per case, hourly cost); the report recalculates and the
    "demo" labels become "company-supplied".
  - **8 From the customer's side: a journey filmstrip.** One screenshot per step a customer takes from landing
    page to enquiry form, with the friction marked on each (clicks, form fields, load time, dead ends).

## Research

Step 0b, 20261026. Three `researcher` lanes (claude-sonnet-5-5), full reports with every citation in
`docs/research/0b-principles.md`, `0b-building-blocks.md` and `0b-tools.md`. Spot-checked by the main session
against the primary pages: Claude 5.5 prices, Claude data residency, the n8n licence wording, Supabase Free pausing,
and every workspace path below. **Picks (Henri, 20261026): all verdicts stand as listed.**

### Principles (how to build it well)

| # | Candidate | What it means for Proofloop | Access | Maturity | Verdict | Source |
|---|-----------|-----------------------------|--------|----------|---------|--------|
| P1 | WCAG 2.2 form criteria (3.3.2, 1.3.5, 2.5.8, 4.1.2) | The only normative checks: labels, required marking, `autocomplete`, 24 px targets. Criteria that need typing or submitting (3.3.1, 3.3.3, 3.3.7) are reported "not assessed" | Free | W3C Rec 20241212 | Use | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| P2 | NN/g form guidance, Seckler et al. (CHI 2014, N=65) | Heuristic checklist: field count, single column, persistent labels, required/optional marked; tagged "heuristic" | Free | 2014–2018 | Use | [NN/g](https://www.nngroup.com/articles/web-form-design/) |
| P3 | Core Web Vitals + Lighthouse variability guidance | CWV claims only from field data (CrUX). Lab Lighthouse = median of 5 runs with version recorded; never "passes CWV" from a lab run | Free | web.dev 20241031; Lighthouse 13.5.0 | Use | [web.dev](https://web.dev/articles/vitals), [variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md) |
| P4 | HM Treasury Green Book 2026 (+ optimism-bias supplement) | Calculator vocabulary: released hours are "non-cash-releasing" unless budgets change; sensitivity analysis; break-even as "switching value"; an explicit, labelled haircut on user-entered minutes saved (not its percentages) | Free (OGL) | 20260205 | Use; adapting public-sector guidance to firms is a judgment call | [Green Book](https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government/the-green-book-2026) |
| P5 | Sauro & Lewis small-N statistics; NN/g within-subject; Kohavi et al. | Times as geometric mean with interval, rates with adjusted-Wald; counterbalanced order with matched case sets; one primary metric + guardrails fixed before measuring; below N=20 results are descriptive | Articles free, books paid | 2016; 2020 | Use | [Sauro & Lewis](https://measuringu.com/wp-content/uploads/2017/07/Sauro_Lewis_CHI2010.pdf), [NN/g](https://www.nngroup.com/articles/between-within-subjects/) |
| P6 | METR randomised trial (2025) | People believed AI made them 20% faster; measured, it made them 19% slower. Precedent for measuring time instead of asking, and a strong case-study citation | Free | 20250712 | Borrow | [arXiv 2507.09089](https://arxiv.org/abs/2507.09089) |
| P7 | Contain the model (OWASP LLM01, Beurer-Kellner et al. design patterns, NCSC) | The analysis model gets no tools, no network, no secrets; it returns schema-validated JSON that code checks. Prompt injection has no complete fix, so contain rather than detect | Free | OWASP 2025 / 2026 v1.0 | Use | [OWASP](https://genai.owasp.org/llmrisk/llm01-prompt-injection/), [patterns](https://arxiv.org/abs/2506.08837) |
| P8 | OWASP SSRF Prevention Cheat Sheet | Allow-list; resolve and pin the IP; follow redirects by hand with a re-check per hop; block v4 + v6 incl. IPv4-mapped and 169.254.169.254; egress firewall for the browser | Free | — | Use | [OWASP SSRF](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) |
| P9 | Attribution checking (AIS rubric, ALCE, LLM-as-judge pitfalls) | Two layers per claim: deterministic (evidence ID exists, quote matches) and support (human-labelled gold set; any model judge from another model family, with its agreement reported) | Free | 2023 | Use | [AIS](https://aclanthology.org/2023.cl-4.2/), [ALCE](https://arxiv.org/abs/2305.14627), [Zheng](https://arxiv.org/abs/2306.05685) |
| P10 | Lead-response statistics (HBR 2011; MIT/InsideSales 2007) | Not usable as an assumption: observational, vendor-linked, often misattributed. At most a reason to ask the company for its own response times | — | — | Skip as input | [0b-principles](research/0b-principles.md) |
| P11 | GDPR minimisation, RFC 9309 robots.txt, §5 DDG | Redact or discard staff names/photos before storing; retention TTL; Impressum and contact pages carry personal data by law; honour robots.txt as policy, not legal clearance. Not legal advice | Free | GDPR; RFC 9309; EDPB draft 03/2026 | Use | [Art. 5](https://gdpr-info.eu/art-5-gdpr/), [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) |
| P12 | Destatis labour cost per hour | Citable default for the fictional hourly cost: €45.00 (2025, all sectors), labelled as such | Free | 20260429 | Use as labelled default | [Destatis](https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/04/PD26_148_624.html) |
| P13 | Chart guidance (Apple HIG Charts, WCAG 1.4.11, W3C complex images) | One message per chart, no colour-only meaning, critical values visible without hovering, a data table beside each chart, the PDF mirrors the HTML | Free | — | Use | [HIG](https://developer.apple.com/design/human-interface-guidelines/charts) |

### Building blocks: this workspace

Paths under `~/claude`. Nothing for Supabase, PWA, Lighthouse, axe, Zod, promptfoo or TS charts exists yet.

| # | Candidate | What it gives Proofloop | Verdict |
|---|-----------|-------------------------|---------|
| W1 | `atlas/main/project/preview.js` (+ `atlas/test/project/preview.test.js`) | SSRF-safe Node fetch: private-address BlockList, guarded DNS lookup, manual redirects with per-hop check | Use as the fetcher behind the URL guard; add `64:ff9b::/96`, `2002::/16` and a port allow-list |
| W2 | `topsim-copilot/` scaffold | Working Vite + React + TS + Vitest + playwright-core setup | Use; bump versions |
| W3 | `kern/lib/rubric.js`, `kern/lib/claude.js`; [[model-batch-validation-before-persistence]]; `Pressespiegel/pressespiegel.py` test vectors | Untrusted text in a random-suffix tag, schema + `validate()`, an `ask()` seam, validating the whole model answer against what was sent, hostile test vectors | Borrow; swap the CLI call for the Anthropic SDK, money in integer cents |
| W4 | `trading-app/` Versuchsregister, Wilson interval, quality standards | Hypothesis registered before the run with no delete path; minimum-n display rule; Decimal-only money; 4 test layers incl. mutation | Borrow the design (Python → TS) |
| W5 | `atlas/core/design/color.js` + `atlas/test/design/contrast.test.js` | WCAG contrast gate over design tokens | Borrow |
| W6 | Local n8n in Docker ([[docker-desktop-local-n8n]]) | n8n 2.43.8 on loopback port 5678 | Use as the import-test target |

### Building blocks: open source and APIs

| # | Candidate | What it gives Proofloop | Licence / cost | Maturity | Verdict | Source |
|---|-----------|-------------------------|----------------|----------|---------|--------|
| O1 | Playwright | Screenshots, text, request interception, tagged PDF (`page.pdf({tagged:true})`) for the one-page report | Apache-2.0 | 1.64.1, 20261014 | Use | [docs](https://playwright.dev/docs/network) |
| O2 | Lighthouse | Lab performance, median of 5 runs | Apache-2.0 | 13.5.0, 20260918 | Use (performance only) | [npm](https://registry.npmjs.org/lighthouse/latest) |
| O3 | Chrome UX Report (CrUX) API | Real-user Core Web Vitals for public origins without running a browser | Free, API key | 28-day data | Use; PageSpeed Insights only as fallback | [CrUX](https://developer.chrome.com/docs/crux/api) |
| O4 | axe-core + @axe-core/playwright | Accessibility violations on the already-guarded page | MPL-2.0 | 4.14.0, 20261005 | Use | [repo](https://github.com/dequelabs/axe-core) |
| O5 | Recharts (+ shadcn chart) | Bar charts; waterfall as stacked bars | MIT | 3.10.1, 20260725 | Use, always with an HTML table (its accessibility layer has VoiceOver gaps) | [repo](https://github.com/recharts/recharts) |
| O6 | shadcn/ui on one base (Radix or React Aria) | Accessible components, copied in | MIT / Apache-2.0 | Active, 202610 | Use; pick one base | [shadcn](https://ui.shadcn.com/docs/changelog) |
| O7 | decimal.js + integer cents | Exact money arithmetic | MIT | 10.6.0, 20250706 | Use | [npm](https://registry.npmjs.org/decimal.js) |
| O8 | Zod 4 + `@anthropic-ai/sdk` structured outputs | Typed model output. The API rejects max/min constraints, so "at most 3 findings" and evidence links are checked in our code | MIT; Apache-2.0 | 4.6.7; 1.3.0, 202610 | Use | [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) |
| O9 | promptfoo | Benchmark runner + indirect-prompt-injection red-team plugin (local generation only) | MIT | 0.125.1, 20261025 | Use for the eval set | [plugin](https://www.promptfoo.dev/docs/red-team/plugins/indirect-prompt-injection/) |
| O10 | fast-check + StrykerJS | Property and mutation tests for the calculator | MIT; Apache-2.0 | 4.10.2; 10.1.1, 202609–10 | Use | [stryker](https://registry.npmjs.org/@stryker-mutator/vitest-runner/latest) |
| O11 | Smokescreen (Stripe egress proxy) | Proxy that resolves DNS itself: the clean fix for DNS rebinding through the browser | MIT | Version tag unclear | Borrow later, if the hosted worker needs it | [repo](https://github.com/stripe/smokescreen) |
| O12 | robots-parser | robots.txt courtesy check | MIT | 3.0.1, 20230221 (stable) | Borrow, optional | [npm](https://registry.npmjs.org/robots-parser) |
| O13 | Skipped: Mozilla Readability, SSRF npm libs, Chart.js / Observable Plot / visx, @react-pdf/renderer, simple-statistics | Readability strips form elements; SSRF libs have advisories and W1 covers them; one chart lib is enough; react-pdf has no tagging evidence | — | — | Skip | [0b-building-blocks](research/0b-building-blocks.md) |

### Tools and services

| # | Candidate | What it gives Proofloop | Licence / cost (demo scale) | Maturity | Verdict | Source |
|---|-----------|-------------------------|-----------------------------|----------|---------|--------|
| T1 | Claude Messages API: Sonnet 5.5 for findings, Haiku 5.5 for enquiry triage / an injection screen | One call per audit, structured output, no tools | $2 / $10 and $0.10 / $0.50 per MTok in/out (verified 20261026); ~$0.06 per audit on Sonnet | Retirement not before 2027-09 | Use | [pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| T2 | Claude Agent SDK | Claude Code's agent loop as a library; spawns a subprocess with shell and web tools | Same API billing, ~2–4x the tokens | 0.3.x, pre-1.0 | Skip for v1: an agent loop over untrusted page text is the injection risk the brief rules out | [secure deployment](https://code.claude.com/docs/en/agent-sdk/secure-deployment) |
| T3 | Dedicated Console workspace with its own spend cap | Hard monthly limit (the Default Workspace cannot have one) | $0 | GA | Use | [limits](https://platform.claude.com/docs/en/api/rate-limits) |
| T4 | Vite + React + Vitest + Playwright Test (+ vite-plugin-pwa later) | Static SPA, no server tier; reuses W2 | MIT / Apache-2.0 | Vite 8.3.5, React 19.3.1, 202609–10 | Use; skip Next.js, SvelteKit, Astro | [vite](https://registry.npmjs.org/vite/latest) |
| T5 | Local Docker worker: Playwright image as `pwuser` with seccomp | Restricted collection worker for v1 | $0 | 1.64.1 | Use | [docker](https://playwright.dev/docs/docker) |
| T6 | Google Cloud Run Jobs, Frankfurt (europe-west3) | Hosted worker: one container per audit, egress firewall via VPC | Likely inside the free tier (Jobs allowance unverified) | GA | Use for the hosted phase | [vpc](https://docs.cloud.google.com/run/docs/configuring/vpc-direct-vpc) |
| T7 | Cloudflare Browser Run, Browserless, Fly.io, Render / Railway free | Hosted browsers or VMs | — | — | Skip: no Lighthouse or EU placement, no free tier, or too small | [0b-tools](research/0b-tools.md) |
| T8 | Supabase Free, Frankfurt; Edge Functions for secrets; a jobs table | Postgres + RLS, storage for screenshots, enqueue only | $0; pauses after 1 week idle (verified); Pro $25 | GA | Use for the hosted phase | [pricing](https://supabase.com/pricing) |
| T9 | Cloudflare static hosting | Frontend | $0 (Vercel Hobby is non-commercial only) | GA | Use | [cf](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) |
| T10 | n8n Community Edition, self-hosted | Demo improvement + importable workflow files. Licence (verified): own demo and building workflows for companies are allowed; exposing the editor to visitors is not. Strip credential IDs from exports | $0 (Cloud from €20) | 2.44.7, 20261026 | Use | [licence](https://docs.n8n.io/n8n-community-license/sustainable-use-license.md) |
| T11 | Make (blueprint JSON), Zapier, Power Automate | "Or similar programs" | Free tiers | — | Plain steps for all; Make blueprint optional | [0b-tools](research/0b-tools.md) |
| T12 | MCP servers: Supabase (read-only, dev project), Mobbin, Figma | Migrations and advisors; UI references; design | — | — | Use; others skip | [0b-tools](research/0b-tools.md) |
| T13 | Skills: tdd, codebase-design, frontend-design, apple-design, dataviz, security-review, dogfood, verification-before-completion | Calculator and URL-guard TDD, module seams, the visual bar, chart palettes, worker review, QA | — | — | Use at the matching step | [0b-tools](research/0b-tools.md) |

**Estimated operating cost** (0b-tools, 100 audits a month): ~$0.4–6.5 for v1 run locally (Sonnet 5.5 findings, Haiku
5.5 triage), ~$6.5–52 hosted worst case (Supabase Pro, n8n Cloud). Screenshots sent as images add ~$2.70.

### Questions research raised (for the grill)

1. **Data leaves the EU.** The Claude API has no EU inference: only `us` or `global`, and data at rest is stored in the US
   (verified). Send only redacted text and disclose it, or look at Claude through an EU-region cloud endpoint (not
   researched)?
2. **Live audits only on owned or consented domains?** That sets the GDPR and terms-of-service burden.
3. **Hosting in v1?** The brief asks for "runs locally" plus prepared deployment instructions; T6/T8/T9 may stay
   instructions only.
4. **Human tests:** what N, and what result counts as "failure", fixed before testing?
5. **Haircut** on user-entered minutes saved: what value, labelled as judgment?

## Grill (step 1)

Goal (Claude's restatement, 20261026): Proofloop audits one public enquiry journey, links every finding to
inspectable evidence, recommends the simplest fix that works (no change, UX, rules/n8n, integration, AI) and shows
savings deterministically from labelled inputs. A fictional business proves the whole loop: evidence → finding →
change built in n8n → measured comparison, including one recommendation that does not pay off. v1 runs locally by
20270115 as a portfolio piece for fintech product/strategy interviews.

Process note: step 0 missed the design part of D0 (Henri's design directions: a feel in 2–3 words plus one app he'd
point to). It is caught up at the start of the design grill (D1), before any Mobbin references.

### Decisions

(one line per answered question: question, answer, date)

- **Q1 Demo business** (20261026): a fictional independent mortgage and insurance broker in Berlin. Journey: website
  enquiry → qualification (income, property, timing) → advice appointment. Enquiry handling only, never advice;
  every name invented and labelled fictional, no resemblance to a real firm.
- **Q2 Live audit scope** (20261026): a private allow-list Henri approves domain by domain, max 5 pages per audit.
  Personal data is cut out before anything is saved, raw data is deleted after a set retention time, robots.txt
  is respected. Real-company audits stay on Henri's machine and never reach the public demo or case study without
  the owner's consent; only the fictional broker is shown publicly.
- **Q3 What goes to Claude** (20261026): cleaned text only. Proofloop's own code strips names, email addresses and
  phone numbers and drops the Impressum first; Claude gets that text plus the measurements. Screenshots never
  leave the machine; a visual finding links its screenshot as local evidence. README and UI say plainly that page
  text is processed by Anthropic outside the EU. An EU cloud endpoint is a possible later upgrade.
- **Q4 Hosting in v1** (20261026): local, plus a read-only static demo of the fictional broker's prepared audit on
  Cloudflare, with a visible capture date and a "prepared demo" label. No live collection, database or API key
  online; visitors' own calculator numbers stay in their browser and are never stored. Live audits, n8n and Claude
  stay local. Publishing needs Henri's explicit OK at the time. Supabase and the cloud worker stay documented for
  later.
- **Q5 First ticket** (20261026): the savings calculator (pure module with tests plus a plain screen to try it),
  which also sets up the project skeleton and check command. Then the evidence collector with URL guard, then the
  fictional broker's site.
- **Q6 Money presentation** (20261026): break-even is the headline ("pays off from N enquiries a month": setup
  spread over the payback period plus running costs, divided by the staff-time value one enquiry frees). Below it:
  hours freed per month and their staff-time value, labelled "not cash saved"; costs on their own line. Every number
  shows its source (demo / company-supplied / measured); a result carries the weakest label among its inputs.
  Worked example (demo): 120 enquiries, 6 min saved − 1 min review = 5 min net, €45/h, €10/month running, €720
  setup over 12 months → €3.75 per enquiry, €70/month cost → pays off from 19 enquiries a month; frees 10 h =
  €450 of staff time a month.
- **Q7 Uncertainty** (20261026): low / expected / high for the two guessed inputs, net minutes saved per enquiry
  (after review and corrections) and enquiries per month; hourly cost, running cost and setup cost stay single
  values. A switching-value line: "still pays off as long as it saves at least X minutes per enquiry". No invented
  safety discount: the user's low value does that job. After the validation test, the measured value replaces the
  range and is labelled "measured". Demo ranges: minutes 3 / 5 / 7, enquiries 80 / 120 / 160.
  Worked example: at 120 enquiries and €70/month cost, the switching value is 70 ÷ (120 × €0.75 per minute) =
  0.78 min (shown as "at least 0.8 minutes"). The grill question had said 1.6 minutes; that was a calculation slip,
  corrected here. Break-even enquiries by scenario: 3 min → 32, 5 min → 19, 7 min → 14.
- **Q8 Design track timing** (20261026): ticket 1 ships the calculator logic with tests plus a plain test page
  (browser-default styling, marked temporary). The design track (D0 catch-up, D1 design grill, D2 Mobbin, D3
  tokens and motion, D4 prototype) runs as its own block before the first designed screen; the plain page is
  thrown away then.

### Calculator conventions [A] (Claude's defaults for ticket 1, open to Henri's veto)

- Payback period for spreading setup cost: an input, default 12 months, labelled "assumption".
- Rounding always against the recommendation: benefits (hours freed, staff-time value) rounded down, thresholds
  (break-even enquiries, switching-value minutes) rounded up; hours to one decimal, euros whole. Money computed
  exactly (decimal.js), never in floats; rounding only for display.
- Net minutes saved ≤ 0 → "never pays off at these inputs", no break-even number. Net minutes may be negative (the
  new way is slower, as METR measured): the result then says how many hours a month it adds.
- Validation: no negative values except net minutes saved; low ≤ expected ≤ high; enquiries and payback months are
  whole numbers; hourly cost > 0; payback ≥ 1 month; currency EUR only.
- Input labels, weakest first: demo → assumption (a Proofloop default) → company-supplied → measured. A result takes
  the weakest label among its inputs. These are provenance labels for numbers; the fact / hypothesis / estimate /
  measured labels for findings come with the findings ticket.

## v1 scope (revised for the pivot, 20261028)

**[R] Requirements:** `BRIEF.md` with its 20261028 amendment. Proofloop tells a small business what in one process
can be automated with n8n, how, with which tools, and when it pays off; the brief's acceptance criteria and
portfolio deliverables still apply. The pivot decisions P-Q1–P-Q10 and the earlier decisions that still hold (Q1
broker, Q2 allow-list, Q3 cleaned text only, Q4 local plus static demo, Q6/Q7 break-even and switching value, Q8
design track timing) narrow how.

**Changes to earlier decisions** (proposed by Claude, approved by Henri 20261028 together with the plan):

1. **Findings are rule-based.** Claude appears only in the AI-versus-rules test on fictional enquiries (ticket 12).
   Q3 had Claude turn observations into findings; with the pivot the findings come from intake answers and website
   signals that rules handle, and keeping Claude off the critical path removes an untrusted-input and cost surface.
   Q3's cleaned-text rule and the outside-EU disclosure still apply. Rejecting this restores Q3: Claude drafts the
   findings, ticket 15 becomes adversarial, and the spend cap is needed before 15.
2. **The journey filmstrip (idea 8) leaves v1**; the website audit no longer collects a page-by-page journey. The
   Make / Zapier / Power Automate plain steps stay, but are second in the cut order. Rejecting this adds a
   filmstrip ticket after 11 and puts it first in the cut order.
3. **One tested tool per block.** P-Q3 says Proofloop "fills in the company's tools". To keep "only tested
   blueprints", each v1 block ships with one tool, tested against its mock; a company on another tool sees that
   tool's tier and "no tested blueprint for <tool> yet", never an untested swap. Rejecting this adds tool variants,
   each with its own mock and recorded run, to tickets 10 and 13 (both grow to L, so the schedule moves).

**Not in v1** (stated so no one assumes slack): speed measurements (Lighthouse, CrUX); hosted live collection and
Supabase (deployment instructions only); more than one process (a second fixture proves the data model is
process-agnostic); AI-drafted blueprints; an EU-hosted model; the self-service intake link; larger companies; the
journey filmstrip; tests against live vendor APIs (blueprints are tested against local mocks); the optional AI
sorting block and its personal-data removal step (P-Q9; v1 uses Claude only on fictional enquiries in ticket 12);
more than one tested tool per block, and per-company edits of a blueprint (change 3); and the brief's deferred
list (native apps, enterprise integrations, unrestricted crawling, autonomous modifications, a universal
score).

Where Henri's ideas land:

| Idea | Ticket(s) |
|------|-----------|
| 1 Visually appealing, function first | 08 design track, 16 and 18 designed screens, charts with tables |
| 2 Downloadable reports | 18 (print-ready recommendation page and PDF export) |
| 3 n8n | 02 harness and capture block, 10 / 13 / 20 blueprints, 14 recommender |
| 4 Only what will really work | 02 "tested" definition, 04 gate order, 10 and 13 approval gate, 15 "insufficient evidence" and "don't automate" verdicts |
| 5 Savings front and centre | 01 calculator, 14 tool and setup costs in the break-even, 18 calculator screen |
| 6 "Don't buy this" verdict | 01 "never pays off", 12 AI-versus-rules result, 15 verdicts |
| 7 Company-supplied inputs | 04 intake (filled in with the company, kept on Henri's machine), 22 static demo (visitors' numbers stay in their browser) |
| 8 Journey filmstrip | not in v1 (change 2 above) |

## Tickets (revised for the pivot, 20261028)

Planning method: three independent plan drafts (risk first, demo first, smallest complete), each scored by three
judges (coverage, schedule realism, workflow compliance); this plan merges the demo-first structure (schedule and
workflow winner) with risk-first's early n8n harness, fixtures and protocol tickets (coverage winner) and fixes every
must-fix the judges raised. A four-lens critic pass (consistency, schedule and workflow, ticket 01 numbers,
boundaries), each lens checked by a skeptic, then confirmed 24 findings on the first version; all are worked in.

One ticket = one slice under ~200 KB of diff, reviewed and committed on its own. Only ticket 01 is written out; each
later ticket gets its file and Brief when it comes up, and may be split along the pre-agreed lines below. The check
gate runs `npm test` (tsc + Vitest) only; Docker, n8n and Playwright suites run as `npm run test:integration` by the
main session, with the result quoted in each handoff. Model column: a main-session ticket names its session model,
**Opus** (claude-opus-5-5) for hard slices (adversarial review or size L) and grill-like work (07, 08), **Sonnet**
(claude-sonnet-5-5, the workspace default) otherwise; each ticket starts a fresh session on its model.
slice-builder = claude-sonnet-5-5, effort medium; researcher = claude-sonnet-5-5. Weeks: W1 = week of Monday 20261026; W8 ends
Friday 20261218 (feature freeze); W9–W10 (20261221–20270103) are buffer with no work planned; W11–W12 run to Friday
20270115. Size: S / M / L, where L is a hard slice that takes most of a week; **at most one L ticket per week**.
Auto-continue on `auto/v1` stops at tickets touching money, secrets or auth, or data deletion (01, 02, 04, 09, 12,
14): those end in a handoff. Design track: D0–D4 in 08; D5 (tokens only, motion on transform and opacity only) goes
into the Briefs of 16, 18 and 19; D6 is their apple-design review plus the motion check (a recording, the
reduced-motion state, measured contrast); D7: the chosen direction goes into a design note at 08's sign-off,
updated at 18.

| # | Ticket | Size | Model | Review | Target |
|---|--------|------|-------|--------|--------|
| 01 | Calculator adapted to cases per month (process noun for display), project skeleton, check command, temporary plain page ([issue](issues/01-savings-calculator.md)) | M | Opus | adversarial (money) | W1–W2 |
| 02 | n8n test harness and the first blueprint: pinned n8n in Docker, local mocks and a mail sink, recorded runs; the **capture** block (authenticated webhook → normalised enquiry → mock CRM); the blueprint metadata format (fit conditions, tools and tier, running cost, setup hours and one-off fees, review minutes, n8n version, what each mock stands in for, optional plain steps for Make / Zapier / Power Automate; tier and prices provisional until 14); an export check that fails on credential names and IDs, on secret-like values in node parameters (seeded fake credential, fake secret in an HTTP Request header) and on any Webhook or resume trigger without authentication (seeded unauthenticated node); the human-approval gate as a reusable step. Writes the "tested" definition; if it cannot be met, P-Q3 reopens before any further blueprint | L | Opus | adversarial (secrets, auth) | W2 |
| 03 | Fixtures: the broker's 3-page site with planted friction and a booking embed, a form that records any submission, a login-walled page, hostile and harmless pages, vendor embed snippets from official docs, 40 fictional enquiries with gold routes (a few with hostile text); all labelled demo / fictional | M | slice-builder | standard | W2–W3, parallel to 02 |
| 04 | Intake model: process-agnostic (SIPOC, steps, volume, last-10-cases, tools with a "has API" answer), PCEF ratings with provenance and "don't know", gate order, Art. 22 flag; a data screen that blocks names, contact details and health information in the last-10-cases table; real intakes only in a gitignored local folder, with a test that only fixtures are tracked; the broker's intake and last-10-cases fixture (demo) and a second-process fixture; adapter into the calculator's low / expected / high | L | Opus | adversarial (money: the adapter) | W3 |
| 05 | URL guard, evidence record, private allow-list (max 5 pages per audit), tested against 03's hostile URLs | M | Opus | adversarial (external input) | W3 |
| 06 | Walking skeleton (Demo v0): the plain page runs the whole loop on fixtures: intake → rule-based pick → 02's capture blueprint → break-even | M | Sonnet | standard | W4 (Demo v0 by 20261120) |
| 07 | Human-test protocol, measurement harness and recruitment: frozen hypothesis, primary metric, failure criterion, N, matched case sets, consent (covering publication of raw timings), raw-data schema with pseudonymous tester IDs (the name key stays in a gitignored local folder; a test checks that only pseudonymous data is tracked), 2-person pilot | S | Opus with Henri | standard | W3–W5 |
| 08 | Design track D0–D4: directions, design grill, Mobbin references, tokens and motion, prototype; design note (D7) at sign-off | M | Opus with Henri | apple-design on the prototype | W4–W5, sign-off by 20261130 |
| 09 | Collection worker: Playwright in Docker as `pwuser` with seccomp; read-only (navigation only: no form submission, no typing, no sign-in; tested with 03's recording form and login-walled page); every request through 05; text and local-only screenshots; personal-data stripping; automatic retention purge; robots.txt | L | Opus | adversarial (external input, data deletion) | W4 |
| 10 | Blueprint blocks A: **qualification and routing** (completeness check, missing-document flag, "probably outside our offer" mark, route to an advisor queue; a person decides before any customer email), document request, CRM contact with duplicate check; plus the mocks these blocks need | M | Opus | adversarial (Art. 22, external input) | W5 |
| 11 | Website signals: enquiry entry point, tool detection from our own fingerprint list (vendor docs, no GPL database), accessibility of the enquiry form (axe, read-only through 09), and a keep-or-cut value check; every signal tagged "observed on the website" | M | Opus | adversarial (external input) | W6 |
| 12 | AI-versus-rules test: 10's rules vs Claude on 03's 40 fictional enquiries, cleaned text only; Messages API with no tools and no network access, schema-validated JSON checked in code, key from the environment only; raw outputs recorded. Needs Henri's dedicated workspace and spend cap first | M | Opus | adversarial (API key, untrusted input) | W7 |
| 13 | Blueprint blocks B: slot proposal (behind the approval gate), confirmation and reminders (exempt from the gate: an appointment the enquirer booked), advisor handover; enquiry text cannot inject into mail templates; plus the mocks these blocks need (e.g. a calendar) | M | Opus | adversarial (external input, customer mail) | W5 |
| 14 | Tool catalogue and recommender: vetted tools with tier, EU option and price (a researcher lane verifies and cites them in W5); tier rated per action (a trigger-only node is tier 3 for its actions); fills the blueprints' provisional tier and price fields; each block has one tested tool (change 3): a company on another tool sees that tool's tier and "no tested blueprint for <tool> yet", and the download is always the tested file; running cost (tool prices + n8n hosting) and setup cost (setup hours × rate + one-off fees) into the calculator | L | Opus | adversarial (money) | W6 |
| 15 | Findings: at most 3 rule-based recommendations, each linked to evidence and labelled fact / hypothesis / estimate / measured, with the provenance tag next to each fact; evidence-reference validator; "insufficient evidence" and "don't automate" verdicts; Art. 22 note; outside-EU disclosure in UI and README (Claude runs outside the EU; v1 uses it only on fictional data; an AI step a company adds must not receive personal or health data) | L | Opus | standard | W7 |
| 16 | Designed UI-A: app shell, define audit and intake form, audit overview with what the evidence allows, evidence inspector | M | slice-builder | standard + apple-design | W7 |
| 17 | Human test sessions: manual handling vs the n8n workflow on matched fictional enquiries, raw data, descriptive results | M | Sonnet with Henri | standard | W7–W8 |
| 18 | Designed UI-B: recommendation detail (tools with tier, EU option and price; "tested against local mocks of <vendor>, not the live API, on n8n <version>") with blueprint download, calculator with charts and tables, print-ready page and PDF export | M | slice-builder | standard + apple-design | W8 |
| 19 | Validation flow and results view: hypothesis register, one metric with guardrails, results with limitations, reading 07's raw-data schema; a measured result below N=20 shows N and "descriptive" (tested) | M | Sonnet | standard + apple-design | W8 |
| 20 | Follow-up block: a researcher lane on UWG §7, §34d GewO and IDD first, then the consent-gated follow-up blueprint behind the approval gate, with its tier and price fields from 14's catalogue (first cut) | S | researcher → Opus | adversarial (customer mail, consent) | W8 |
| — | **Feature freeze 20261218; W9–W10 buffer** | | | | |
| 21 | Eval set and benchmark: genuine issues, harmless pages, insufficient information, hostile instructions; two-layer evidence check; raw results and limitations | L | Opus | adversarial | W11 |
| 22 | Static prepared-demo build (with capture date), README, deployment instructions incl. the hosted phase, a "roadmap, not built" section | M | Sonnet | standard | W11 |
| 23 | Case study, interview script, CV bullet with placeholders for anything not measured; states what "tested" covers (local mocks, pinned n8n) and that Claude ran only on fictional data, outside the EU | M | Sonnet | standard | W12 |
| 24 | Release hardening: fresh-clone run, `npm audit` and licences, every blueprint re-tested on the pinned n8n, a table of every review file and each finding's disposition (all tickets, security areas first: 02 webhook and export check, 05 guard, 09 worker, 10 and 13 customer mail, 12 API wrapper), acceptance checklist; its own diff gets the adversarial review | M | Opus | adversarial (own diff) | W12 |

`tools/review.sh` reviews the uncommitted diff, so every security area is reviewed in the ticket that builds it;
ticket 24 does not re-review committed code, it checks that those reviews exist and every finding has a disposition.

**Pre-agreed split lines** (if a ticket nears 200 KB): 02 harness vs the capture block (06 then waits for the
block); 04 model and PCEF vs data screen, tracked-files test and adapter; 09 worker vs stripping and purge (the
worker never ships without them); 13 by block; 14 catalogue vs recommender and costing; 15 rules vs the validator;
16 and 18 by screen group; 19 logic vs results view; 21 eval set vs benchmark runner.

**Henri's dated actions:** name 6–10 testers and check their availability by 20261113; two design sessions in
W4–W5 (D4 sign-off by 20261130); approve the real-site allow-list before ticket 11 (by 20261127); create the
dedicated Anthropic workspace with a spend cap before ticket 12 (by 20261204).

**Cut triggers:** 09 not done or the allow-list not approved by 20261127 → real-site audits shrink to the broker
site plus vendor fixtures. D4 not signed off by 20261130 → designed screens only for the evidence inspector and
calculator, the rest stays plain. 13 not done by 20261204 → 20 is cut and documented as roadmap. No workspace and
spend cap by 20261204 → 12 moves to W11 next to 21 (it stays in v1). Fewer than 6 testers by 20261204 → no human-performance
claim, CV placeholders stay. Fewer than 4 sessions recorded by 20261218 → 17 finishes in 20270104–08 next to 21 and
22, 22's static demo link is cut (the local snapshot stays), 19's results view ships with the pilot data and its
limitation text, and 23 waits for the sessions.

**Cut order** if behind at the freeze: 20 follow-up block → Make / Zapier / Power Automate plain steps → static demo
link (the local snapshot stays) → charts beyond one waterfall with its table → PDF polish (print stylesheet only) →
testers down to 6 → website audit down to tool detection if 11's value check shows no effect. **Never cut:** tested
blueprints with recorded runs, the human-approval gate, the export secret check and webhook auth, the URL guard,
the read-only worker with personal-data stripping and retention purge, evidence links and validator, demo labels,
the outside-EU disclosure, hostile tests, recorded human sessions, the break-even calculator, the AI-versus-rules
test.

### Pre-pivot ticket plan (20261026, replaced)

The earlier 13-ticket plan for the website-centred product is in git history (`bcee6bb`, `docs/spec.md`).

## Reusable prior work

Merged into the Research tables above (W1–W6 and the lane report `docs/research/0b-building-blocks.md`).

- Local toolchain (20261026): Node 22.23.2, npm 10.9.8, Docker present, Playwright Chromium 1208 cached (Playwright
  1.64.1 expects 1248: install it or set `executablePath`), local n8n 2.43.8; Supabase CLI and Lighthouse not
  installed.

## Deferred decisions

Added by the pivot (20261028):

- **n8n licence for the "any process" phase:** whether pushing workflows into a client's n8n, or drafting them with
  AI for outsiders, needs a commercial licence. Henri asks license@n8n.io before that phase; handing out JSON files
  that a company imports itself (v1) is covered as consulting.
- **Rules of the demo domain:** broker regulation (§34d GewO, IDD) and UWG §7 consent for follow-up emails. Research
  in ticket 20, before the follow-up block is built.
- **EU-hosted AI model** for AI blocks on real data (P-Q9). After v1.
- **Self-service intake link** with online storage (P-Q10). After v1.
- **Larger companies** (P-Q6): other methods, after the small-business audit covers a whole company.

From the first grill:

- **Direct Claude API calls vs an own agent on the Claude Agent SDK.** Henri, 20261026: either works. The pivot
  plan (20261028) takes the direct Messages API with no tools, used only in ticket 12. 0b recommends the direct Messages API with no tools (T1/T2): both tasks are single calls with a fixed
  schema, and an agent loop over page text gives untrusted content a shell.
- **Monthly API spend cap (€).** Both options bill through the Anthropic API; the cap goes on a dedicated workspace
  (T3). 0b estimates ~$6.40 a month at 100 audits on Sonnet 5.5. With rule-based findings the only v1 use is ticket 12. Set the amount before ticket 12 (by 20261204).
- **Design track D0–D4.** Ticket 08, before the first designed screen (Q8); starts with Henri's design directions.
- **Raw-data retention period** for real-site audits (Q2). Decide in ticket 09.
- **Human tests:** N, and what result counts as "failure", fixed before testing (P5: below N=20 descriptive only).
  Decide in ticket 07.
- **Where AI is tested in the demo**, and which plausible recommendation is expected not to pay off. AI: ticket 12
  (AI-versus-rules). The recommendation that should not pay off: decide in ticket 15.
- **OWASP edition to cite** (2025 with verified IDs, or 2026 v1.0). Decide in ticket 22 (README).

## Six Hats (revised for the pivot, 20261028)

- **White (facts):** 24 tickets in 10 working weeks (W1–W8, W11–W12); 21 in the main session (16 on Opus, 5 on
  Sonnet; 3 of them with Henri, 1 after a researcher lane), 3 slice-builder; 6 large; 13 with an adversarial
  review. The pivot research checked 40 key claims (0 refuted). The paused calculator has 38 green tests. The
  Claude API cannot process in the EU; n8n has no built-in node for Lexware Office, sevDesk or DATEV.
- **Red (Henri's gut feeling):** "feels right" (20261028). (Pre-pivot plan: "feels right", 20261027.)
- **Black (risks):** capacity: 24 tickets for a student with a part-time job; W4 (09 large, 06, design sessions),
  W5 (10 and 13, the pilot, design sessions) and W7 (15 large, 12, the human sessions, 16 in parallel) are the
  heaviest weeks. Ticket 02 is the biggest unknown: if "tested" cannot be met headlessly, P-Q3 reopens. "Tested"
  means tested against local mocks, so a vendor API change can still break a blueprint. The human tests depend on
  recruiting by 20261113. Rule-based findings make the AI part smaller than an "AI product" pitch might expect.
  The follow-up block's legal rules stay unresearched until 20. The plan answers with dated cut triggers and a
  fixed cut order instead of hope.
- **Yellow (benefits):** a crude but complete demo of the whole loop by 20261120; the brief's intake-and-routing
  example is a tested block by W5; every recommended workflow has a recorded test run; tool and setup costs flow
  into an honest break-even; the AI-versus-rules test gives a real "is AI worth it here?" answer; the data model is
  ready for "any process" and whole-company audits later.
- **Green (strongest alternative not taken):** the smallest-complete plan (14 larger tickets): fewer handoffs, but
  slices too large for the 200 KB review limit and no visible demo before W7. Not taken because the judges scored it
  lowest on workflow compliance and found it hid the riskiest work (n8n harness) until week 4.
