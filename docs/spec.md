# Proofloop — spec

Status: spec approved by Henri 20261027 (steps 0, 0b, 1, 3 done); ticket 01 in build. Requirements: `BRIEF.md`
(Henri, verbatim).
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

## v1 scope

**[R] Requirements:** everything in `BRIEF.md`, in particular its acceptance criteria and portfolio deliverables.
The grill decisions Q1–Q8 above narrow how they are met. **[A] Out of scope for v1** (brief's deferred list plus
grill decisions): native apps, enterprise integrations, unrestricted crawling, autonomous modifications, a universal
score, audits of any URL (Q2), hosted live collection (Q4), an EU cloud endpoint for Claude (Q3), the Claude Agent
SDK (T2).

Where each of Henri's ideas lands:

| Idea | Ticket(s) |
|------|-----------|
| 1 Visually appealing, function first | 05 design track, 06 and 08 designed screens, charts with tables |
| 2 Downloadable reports | 12 |
| 3 n8n | 09 |
| 4 Only what will really work (simplest-fix ladder) | 07 |
| 5 Savings front and centre | 01, 08 |
| 6 "Don't buy this" verdict | 01 ("never pays off"), 07 (verdict) |
| 7 Company-supplied inputs | 01 (labels), 08 (input form), 13 (in the visitor's browser only) |
| 8 Journey filmstrip | 03 (screenshots), 12 |

## Tickets

One ticket = one slice, reviewed and committed on its own. Only ticket 01 is written out now; later tickets get
their file and brief when they come up, and may be split or reordered. Target weeks are [A] rough planning from
the week of 20261026 (week 1) to the deadline 20270115 (week 12), with the Christmas break as buffer.

| # | Ticket | Model | Review | Target |
|---|--------|-------|--------|--------|
| 01 | Savings calculator + project skeleton and check command ([issue](issues/01-savings-calculator.md)) | Main session: money logic is an adversarial-review trigger | `--adversarial` | Week 1 |
| 02 | Evidence model + URL guard (Node fetch from W1, IPv4/IPv6 tests, port allow-list) | Main session: security | `--adversarial` | Week 2 |
| 03 | Collection worker: Playwright in Docker as `pwuser`, every request through the guard, screenshots, text, axe, Lighthouse median of 5, CrUX, personal-data stripping, retention, robots.txt | Main session: security | `--adversarial` | Weeks 2–3 |
| 04 | Fictional broker demo site with planted problems, plus hostile test pages | `slice-builder`, sonnet | standard | Week 3 |
| 05 | Design track D0–D4: directions, design grill, Mobbin, tokens and motion, prototype | Main session with Henri | — | Week 4 |
| 06 | App shell, audit definition, evidence inspector (designed) | `slice-builder`, sonnet | standard + `apple-design` | Week 5 |
| 07 | Findings: deterministic checks, one Claude call on cleaned text, ≤3 findings with evidence-link checks, simplest-fix ladder, "insufficient evidence" and "don't buy this" verdicts | Main session: untrusted input + AI | `--adversarial` | Week 6 |
| 08 | Finding detail, designed calculator with company-supplied inputs, charts with tables | `slice-builder`, sonnet | standard + `apple-design` | Week 7 |
| 09 | n8n intake and routing workflow for the broker, importable recipe (credentials stripped), plain steps for Make / Zapier / Power Automate | `slice-builder`, sonnet | standard | Week 8 |
| 10 | Validation flow: registered hypothesis, one metric, guardrails, baseline, results with intervals; human test protocol and recorded runs | Main session | standard | Weeks 8–9 |
| 11 | Eval set and benchmark (promptfoo): genuine issues, harmless pages, insufficient information, hostile instructions; two-layer attribution check; raw results | Main session: untrusted input | `--adversarial` | Weeks 9–10 |
| 12 | One-page PDF report per finding (tagged `page.pdf`), journey filmstrip | `slice-builder`, sonnet | standard + `apple-design` | Week 10 |
| 13 | Static read-only demo build, README, case study, interview script, CV bullet with placeholders, deployment instructions | Main session | standard | Weeks 11–12 |

## Reusable prior work

Merged into the Research tables above (W1–W6 and the lane report `docs/research/0b-building-blocks.md`).

- Local toolchain (20261026): Node 22.23.2, npm 10.9.8, Docker present, Playwright Chromium 1208 cached (Playwright
  1.64.1 expects 1248: install it or set `executablePath`), local n8n 2.43.8; Supabase CLI and Lighthouse not
  installed.

## Deferred decisions

- **Direct Claude API calls vs an own agent on the Claude Agent SDK.** Henri, 20261026: either works. Decide in
  the grill. 0b recommends the direct Messages API with no tools (T1/T2): both tasks are single calls with a fixed
  schema, and an agent loop over page text gives untrusted content a shell.
- **Monthly API spend cap (€).** Both options bill through the Anthropic API; the cap goes on a dedicated workspace
  (T3). 0b estimates ~$6.40 a month at 100 audits on Sonnet 5.5. Set the amount before the first API call.
- **Design track D0–D4.** Before the first designed screen (Q8); starts with Henri's design directions.
- **Raw-data retention period** for real-site audits (Q2). Decide in the collector ticket.
- **Human tests:** N, and what result counts as "failure", fixed before testing (P5: below N=20 descriptive only).
  Decide before the validation ticket.
- **Where AI is tested in the demo**, and which plausible recommendation is expected not to pay off. Decide in the
  findings ticket.
- **OWASP edition to cite** (2025 with verified IDs, or 2026 v1.0). Decide when writing the README.

## Six Hats

- **White (facts):** 13 tickets in ~12 weeks to 20270115; ticket 01 has 10 acceptance examples and 5 properties;
  the toolchain is ready except Chromium 1248, Lighthouse and the Supabase CLI; the Claude API cannot process in
  the EU.
- **Red (Henri's gut feeling):** "feels right" (20261027).
- **Black (risks):** the schedule is tight with the Christmas break and the Werkstudent job, and the four security
  slices (02, 03, 07, 11) carry adversarial reviews that can add rounds. The human tests in ticket 10 need 6–10
  real participants, so recruiting starts by week 4. A "doesn't pay off" result cannot be planned, only tested
  honestly. If behind by week 8, cut in this order: the filmstrip (12), the Make/Zapier/Power Automate steps (09),
  the static demo link (13); never the audit-to-validation journey the brief requires.
- **Yellow (benefits):** the part Henri cares about most (savings) works and is tested in week 1. Break-even instead
  of "savings" is an honest, defensible headline for fintech interviews. Every number carries its source label from
  the first line of code.
- **Green (strongest alternative not taken):** the evidence collector first (risk first), so the hardest technical
  surprises show up in week 1. Not taken: the calculator sets the labelling rules everything else uses, and the
  collector still starts in week 2.
