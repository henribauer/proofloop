# Step 0b lane: tools (20261026)

Lane report from a `researcher` subagent (claude-sonnet-5-5), kept as delivered. The condensed picks are in
`docs/spec.md` under `## Research`. All facts seen 20261026 on official docs, registries or release feeds.
Verdicts are judgment calls; "unverified" = could not confirm from a primary source.

## Candidates

| Candidate | What it gives us | Licence / cost (monthly, demo scale) | Maturity | Verdict | Source |
|---|---|---|---|---|---|
| **AI** | | | | | |
| Claude Messages API + `@anthropic-ai/sdk` | Per MTok in/out: Fable 5.1 $10/$50, Opus 5.5 $4/$20, Sonnet 5.5 $2/$10, Haiku 5.5 $0.10/$0.50 (Haiku 5x dearer above 100k-token prompts) | Per token, ~$0.3–6.4 (see cost table) | SDK 1.3.0 20261023; retirements not before 20270901 (Fable) to 20271007 (Haiku) | Use: Haiku 5.5 for triage and an injection screen, Sonnet 5.5 for findings; compare on a small eval set | [pricing](https://platform.claude.com/docs/en/about-claude/pricing), [models](https://platform.claude.com/docs/en/about-claude/models/overview), [sdk](https://api.github.com/repos/anthropics/anthropic-sdk-typescript/releases/latest) |
| Structured outputs | `output_config.format` JSON schema; zod via `zodOutputFormat()`/`messages.parse()`. No min/max/length constraints | No fee, slightly more input tokens | GA on all 5.x models | Use, then re-validate with zod and check evidence IDs exist | [doc](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) |
| Prompt caching, Batch API | Cache reads 0.05x on Sonnet/Opus 5.5, min 512 tokens, 5-min TTL. Batch −50%, most done in <1 h | Caching saves <$0.01 per audit at <100 audits/month | GA | Skip caching in v1; borrow Batch for offline eval runs | [caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching), [batch](https://platform.claude.com/docs/en/build-with-claude/batch-processing) |
| Claude Agent SDK (TS) | Claude Code's agent loop, tools, hooks and subagents as a library; spawns a `claude` subprocess | Anthropic Commercial Terms; API-key billing; ~1 GiB RAM, 1 CPU per agent | 0.3.310 20261023, pre-1.0, near-daily releases | Skip for v1 (see below) | [overview](https://code.claude.com/docs/en/agent-sdk/overview), [hosting](https://code.claude.com/docs/en/agent-sdk/hosting), [npm](https://registry.npmjs.org/@anthropic-ai/claude-agent-sdk/latest) |
| Console spend limit + workspace | Monthly cap per org or workspace, with alerts | $0; tier caps Start $500, Build $1,000 | GA | Use a dedicated workspace with its own cap (the Default Workspace cannot have one) | [limits](https://platform.claude.com/docs/en/api/rate-limits), [workspaces](https://platform.claude.com/docs/en/manage-claude/workspaces) |
| **Collection worker** | | | | | |
| Local Docker: `mcr.microsoft.com/playwright:v1.64.x-noble` + Lighthouse | Dev worker that matches the hosted one | $0 | Playwright 1.64.1 20261014; Lighthouse 13.5.0 20260918 (Node ≥22.19; local 22.23.2) | Use for v1 | [docker](https://playwright.dev/docs/docker), [lh](https://registry.npmjs.org/lighthouse/latest) |
| Cloud Run Jobs, EU (europe-west4 Tier 1; europe-west3 Frankfurt Tier 2) | One run-to-completion container per audit; Direct VPC egress `--vpc-egress=all-traffic` + firewall rules, supported for Jobs | Free tier 2M req, 180k vCPU-s, 360k GiB-s (listed for request-based billing; Jobs line unverified); Jobs list rate $0.000018/vCPU-s, $0.000002/GiB-s (us-central1) | GA | Use for the hosted phase (trigger from an Edge Function: inference) | [free](https://docs.cloud.google.com/free/docs/free-cloud-features), [regions](https://docs.cloud.google.com/run/docs/locations), [vpc](https://docs.cloud.google.com/run/docs/configuring/vpc-direct-vpc) |
| Fly.io Machines (fra) | Per-second VMs | No free tier (trial 2 h or 7 days); 1 GB shared-cpu-1x $7.73 per 30 days in fra | GA | Borrow as fallback; no egress allowlist found | [fly](https://docs.fly.io/about/pricing) |
| Render Free / Railway Free | Cheap hosting | Render Free sleeps after 15 min, no jobs/cron/workers; Railway Free $1 credit, 0.5 GB per service | — | Skip (too small or sleepy for Chromium) | [render](https://render.com/docs/free), [railway](https://railway.com/pricing) |
| Cloudflare Browser Run (ex Browser Rendering) | Hosted Chrome; Playwright fork (`@cloudflare/playwright`, 1.58.2 base); REST screenshot/markdown; hostname allowlist for sessions only | Free 10 min/day, 3 concurrent, 60 s timeout; paid 10 h incl., then $0.09/h | Docs 202609–202610 | Skip: Lighthouse not documented, no EU placement, always flagged as bot traffic | [limits](https://developers.cloudflare.com/browser-rendering/limits/), [guardrails](https://developers.cloudflare.com/browser-run/features/guardrails/index.md), [faq](https://developers.cloudflare.com/browser-run/faq/) |
| Browserless | Hosted Chrome over Playwright/CDP; Lighthouse `/performance` REST API | Free 1k units, 2 concurrent, 2-min sessions; $25/20k units; self-host SSPL-1.0 or commercial | — | Skip; fallback if running Chrome ourselves hurts | [pricing](https://www.browserless.io/pricing), [perf](https://docs.browserless.io/rest-apis/performance), [licence](https://raw.githubusercontent.com/browserless/browserless/main/README.md) |
| Supabase Edge Functions | Secrets, thin API, enqueue a job | 256 MB memory, 2 s CPU per request, 150 s wall-clock (Free) / 400 s (paid), 20 MB bundle | GA | Use for secrets and enqueue only; the limits rule out Chromium | [limits](https://supabase.com/docs/guides/functions/limits) |
| **Supabase** | | | | | |
| Supabase Free, Frankfurt `eu-central-1` | Postgres + RLS, Auth, Storage | 500 MB DB, 1 GB storage (50 MB file cap), 5 GB egress, 2 active projects, paused after 1 week idle; Pro from $25 | GA | Use; Pro only if the demo must stay awake | [pricing](https://supabase.com/pricing), [regions](https://supabase.com/docs/guides/platform/regions), [files](https://supabase.com/docs/guides/storage/uploads/file-limits) |
| Job hand-off: jobs table vs pgmq Queues | pgmq: visibility window and archive; PG ≥15.6.1.143; not on the Data API by default | $0 | — | Use a jobs table with a `FOR UPDATE SKIP LOCKED` claim (judgment, <100 jobs/month); pgmq if retries grow | [queues](https://supabase.com/docs/guides/queues/quickstart) |
| Supabase CLI local stack | `supabase start`, migrations | $0; needs a Docker-API manager (OrbStack recommended) | Not installed yet | Use | [local](https://supabase.com/docs/guides/local-development) |
| **Framework** | | | | | |
| Vite 8.3.5 + React 19.3.1 + vite-plugin-pwa 2.0.0 + Vitest 5.0.5 + Playwright Test 1.64.1 | SPA on a static host; Safari install needs a manifest with `display: standalone` plus `apple-touch-icon` | MIT/Apache, $0 | All released 202609–202610 | Use: reuses the workspace Vite + React + Vitest scaffold; no server tier to clash with secrets-in-Edge-Functions | [vite](https://registry.npmjs.org/vite/latest), [pwa](https://registry.npmjs.org/vite-plugin-pwa/latest), [webkit](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) |
| Next.js 16.4.3 / SvelteKit 3.1.0 / Astro 7.4.2 | SSR or content frameworks | MIT | Current | Skip: no server runtime needed; Astro 7.4.2 needs Node ≥22.23.4 (local 22.23.2) | [astro](https://registry.npmjs.org/astro/latest), [kit](https://registry.npmjs.org/@sveltejs/kit/latest) |
| Static hosts | Cloudflare Workers static assets: static requests free, unlimited. Vercel Hobby: non-commercial only. Netlify Free: 300 credits | $0 | — | Use Cloudflare | [cf](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/), [vercel](https://vercel.com/docs/plans/hobby), [netlify](https://www.netlify.com/pricing/) |
| **n8n and alternatives** | | | | | |
| n8n Community (Docker) | Self-hosted workflows; JSON import/export (exported JSON carries credential names and IDs) | Sustainable Use License, $0. Allowed: "own internal business purposes or non-commercial or personal use"; "free to offer commercial consulting… (e.g. building n8n workflows)". Not allowed: "making n8n available to your customers for them to connect their accounts and build workflows" | 2.44.7 stable, 20261026 | Use: (a) own demo instance exposing only a webhook, editor private; (b) recommending n8n and handing out workflow JSON, the company runs its own instance. Not legal advice | [licence](https://docs.n8n.io/n8n-community-license/sustainable-use-license.md), [docker](https://docs.n8n.io/hosting/installation/docker/), [export](https://docs.n8n.io/build/manage-workflows/export-and-import.md) |
| n8n Cloud | Hosted, data in Frankfurt | Starter €20 (annual), 2.5K executions; Pro €50, 10K | — | Borrow only if the demo must be always-on | [pricing](https://n8n.io/pricing/) |
| Make | Blueprint JSON import/export (<2 MB) | Free 1,000 credits/month | — | Borrow: plain steps plus optional blueprint | [help](https://help.make.com/blueprints), [pricing](https://www.make.com/en/pricing) |
| Zapier | Free: 100 tasks, two-step Zaps; JSON import/export documented for Team/Enterprise (partly verified) | — | — | Plain steps only | [pricing](https://zapier.com/pricing), [help](https://help.zapier.com/hc/en-us/articles/8496308481933) |
| Power Automate | `.zip` package import ("Legacy"; solutions preferred) | Licence cost unverified | — | Plain steps; zip optional | [learn](https://learn.microsoft.com/en-us/power-automate/export-import-flow-non-solution) |
| Activepieces / Windmill | Open-source automation; Activepieces flows import as JSON (community-forum sourced) | Activepieces MIT except `packages/ee`; Windmill AGPLv3 + Apache + proprietary EE | Activepieces 0.92.3-hotfix.1 20261023; Windmill v1.849.0 20261025 | Skip; n8n is the named target | [ap](https://raw.githubusercontent.com/activepieces/activepieces/main/LICENSE), [wm](https://raw.githubusercontent.com/windmill-labs/windmill/main/LICENSE) |

### MCP servers

Seen in the lane's own tool instructions: Supabase, Vercel, Figma, Airtable, Notion, Google Sheets/Docs/Slides,
Microsoft Learn. Netlify, Mobbin, Canva and Drive verdicts are judgment only.

- **Supabase: use.** Migrations, logs, security/performance advisors. Scope with `project_ref`, `read_only` and
  `features`, on a dev project ([docs](https://supabase.com/docs/guides/getting-started/mcp)).
- **Figma: use** if designing there. **Mobbin: borrow** for dashboard and report layout references.
- **Vercel / Netlify: skip** unless chosen as host. **Canva: skip** (portfolio slides only).
- **Google Sheets: borrow** for validation responses or calculator fixtures. **Drive, Airtable, Notion: skip.**
- **Microsoft Learn: use** to ground the Power Automate plain steps.
- **Built-in browser:** dogfood the local app; test Safari "Add to Home Screen" by hand on a device.

### Skills

- **test-driven-development** (superpowers) and **tdd** (mattpocock): calculator, URL guard, schema validators.
- **codebase-design** (mattpocock): seams for worker, findings and calculator modules.
- **frontend-design** and **apple-design**: the "visually appealing" bar; HIG review of the home-screen app.
- **dogfood**: exploratory QA with evidence before v1.
- **research**, **grilling**, **domain-modeling** (mattpocock): step 0b, the grill, ADRs.
- **verification-before-completion**, **systematic-debugging** (superpowers): evidence before claims; Playwright
  flakes.
- **pdf**, **interactive-dashboard-builder**: check the report PDF; prototype charts only.
- **dataviz** and **security-review**: bundled with Claude Code. dataviz for the savings waterfall and
  colourblind-safe palettes; security-review on the URL guard and worker diff.
- grounded-citations, reference-data-provenance: not found as SKILL.md by the lane (both are listed as available
  skills in the builder's session).

## API vs Agent SDK

- The SDK is Claude Code as a library: it spawns a `claude` subprocess with a shell and a working directory and
  ships Bash, file and web tools ([hosting](https://code.claude.com/docs/en/agent-sdk/hosting)).
- ~1 GiB RAM, 5 GiB disk and 1 CPU per agent plus local-disk sessions: fits only inside the worker container.
- Billing per token on `ANTHROPIC_API_KEY`; `maxTurns` and `maxBudgetUsd` exist; `total_cost_usd` is a client-side
  estimate ([cost](https://code.claude.com/docs/en/agent-sdk/cost-tracking)).
- Anthropic: agent behaviour "can be influenced by the content they process: files, webpages"; prescribes container
  isolation, a network proxy and least privilege
  ([secure-deployment](https://code.claude.com/docs/en/agent-sdk/secure-deployment)). A tool-using loop over page
  text hands injected text a shell, which the brief rules out.
- For untrusted text Anthropic recommends content inside `tool_result`, JSON-encoded, least privilege, and a Haiku
  screen with structured output
  ([mitigate](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)).
  A single Messages call with no tools meets this directly.
- Both Proofloop tasks are single-shot with a fixed schema (observations → ≤3 findings; enquiry → category and
  route). The SDK loop costs ~2–4x the tokens of one direct call (inference: every turn re-sends context).
- **Recommendation (judgment):** direct Messages API with structured outputs, no tools, bounded `max_tokens`,
  deterministic post-checks. Revisit the SDK only for a task that needs multi-step tool use, then inside the
  worker with no Bash or web tools and network only via a proxy.

## Estimated operating cost (monthly)

Assumptions: 100 audits; 17k input tokens (2k rubric + 5 pages at ~3k) and 3k output tokens incl. thinking, one
call, no caching. Sonnet 5.5's default effort is `high`, so set effort and `max_tokens` explicitly.

| Item | Basis | Cost |
|---|---|---|
| Findings, Sonnet 5.5 | $0.064 per audit | $6.40 (Haiku 5.5 $0.32; Opus 5.5 $12.80; Fable 5.1 $32) |
| 5 screenshots as images | +13.5k tokens at 2.7k each (1920x1080) | +$2.70 on Sonnet |
| Demo triage, Haiku 5.5 | 200 enquiries, 1k in / 150 out each | $0.04 |
| Worker | Local Docker $0; Cloud Run Jobs 100 × 180 s × 1 vCPU / 2 GiB | ≤$0.40 at list; likely $0 in free tier (Jobs allowance unverified) |
| Supabase | Free (pauses after 1 week idle) | $0 (Pro $25) |
| Frontend | Cloudflare static | $0 |
| n8n | Local Docker $0; Cloud Starter if hosted | €20 optional |
| **Total** | v1 local / hosted worst case | ~$0.4–6.5 / ~$6.5–52 |

## Pitfalls

- **No EU inference on the Claude API.** `inference_geo` accepts only `"us"` or `"global"`; workspace geo is US only
  ([data-residency](https://platform.claude.com/docs/en/manage-claude/data-residency)). Do not claim EU-only
  processing; disclose that page text goes to Anthropic.
- **Spend-cap behaviour.** A self-set cap returns HTTP 400 `invalid_request_error`; the tier cap returns 429 with no
  `retry-after`, so SDK retries fail. The Default Workspace cannot have a limit
  ([limits](https://platform.claude.com/docs/en/api/rate-limits)).
- **The Playwright Docker image is "meant for testing and development only"** and advised against for untrusted
  sites; running as root disables the Chromium sandbox. Use `--user pwuser`, its seccomp profile, `--init` and
  `--ipc=host` ([docs](https://playwright.dev/docs/docker)).
- **SSRF:** allowlists, re-resolve IPs against DNS rebinding, no auto-follow redirects, block 169.254.169.254,
  network-layer egress control ([OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)).
  Reuse `atlas/main/project/preview.js`; guard browser sub-requests too.
- **Supabase Free pauses after 1 week of inactivity**; whether a keep-alive ping counts is undocumented
  ([pricing](https://supabase.com/pricing)).
- **MCP prompt injection:** untrusted page text stored in Supabase could steer a connected Supabase MCP; keep manual
  approval and read-only on ([docs](https://supabase.com/docs/guides/getting-started/mcp)).
- **Structured output can still fail:** a `refusal` or `max_tokens` stop can leave invalid JSON; treat a declined
  Haiku screen as a "flag" verdict ([structured](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)).
- **n8n:** exposing the editor to visitors breaches the licence; strip credential names and IDs from exported
  workflow JSON ([export](https://docs.n8n.io/build/manage-workflows/export-and-import.md)).

## Could not verify

Cloud Run Jobs EU unit prices; Lighthouse on Cloudflare via CDP; Fly or Cloud Run egress allowlisting beyond VPC
firewall rules; the Windmill flow file format; Netlify's commercial-use terms.
