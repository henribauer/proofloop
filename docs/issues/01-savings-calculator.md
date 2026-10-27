# 01 Savings calculator + project skeleton

Status: ready-for-agent (Henri OK'd the spec and this ticket, 20261027)
Model: main session (money logic is an adversarial-review trigger, so a hard slice)
Review: `tools/review.sh docs/issues/01-savings-calculator.md --repo <proofloop> --adversarial`
Spec: `docs/spec.md` (grill Q5–Q8, calculator conventions)

## Outcome

A deterministic, tested calculator that turns labelled inputs into break-even, hours freed, staff-time value, costs,
three scenarios (low / expected / high) and a switching value. Plus a temporary plain page to try it, and the
project skeleton with its check command. No styling, no network, no AI.

## Inputs

Every input is `{ value, label }`, label ∈ `demo | assumption | company-supplied | measured` (weakest first).

| Input | Shape | Rule |
|-------|-------|------|
| Enquiries per month | low / expected / high | Whole numbers ≥ 0, low ≤ expected ≤ high |
| Net minutes saved per enquiry (after review and corrections) | low / expected / high | Any number, may be negative; low ≤ expected ≤ high |
| Hourly staff cost (€) | single | > 0 |
| Running cost per month (€) | single | ≥ 0 |
| Setup cost (€) | single | ≥ 0 |
| Payback period (months) | single, default 12 labelled `assumption` | Whole number ≥ 1 |

## Outputs (per scenario)

| Output | Formula | Display rounding |
|--------|---------|------------------|
| Monthly cost | running + setup ÷ payback months | € up |
| Value per enquiry | net minutes ÷ 60 × hourly cost | — |
| Break-even enquiries | ⌈monthly cost ÷ value per enquiry⌉; none ("never pays off") if value per enquiry ≤ 0; 0 → "pays off from the first enquiry" | up |
| Pays off | enquiries ≥ break-even | — |
| Hours freed per month | enquiries × net minutes ÷ 60; negative → "adds X hours of work a month" | 1 decimal, down |
| Staff-time value per month | hours freed × hourly cost, always shown with "not cash saved" | € down |
| Switching value | monthly cost ÷ (enquiries × hourly cost ÷ 60): "still pays off as long as it saves at least X minutes per enquiry"; none if enquiries = 0 | 1 decimal, up |
| Label | weakest label among the inputs used | — |

Low pairs low minutes with low enquiries, expected with expected, high with high. All arithmetic in decimal.js;
rounding happens only when formatting for display.

## Acceptance examples

Common inputs unless stated: hourly €45, running €10/month, setup €720, payback 12 months (monthly cost €70), all
labelled `demo`.

| # | Case | Inputs | Expected |
|---|------|--------|----------|
| E1 | Expected (worked example) | 120 enquiries, 5 min | value per enquiry €3.75; break-even 19; pays off; 10.0 h; €450 "not cash saved"; switching 0.8 min; label demo |
| E2 | Low | 80 enquiries, 3 min | break-even 32; pays off; 4.0 h; €180; switching 1.2 min |
| E3 | High | 160 enquiries, 7 min | break-even 14; pays off; 18.6 h (exact 18.67, rounded down); €840; switching 0.6 min |
| E4 | No net saving | 120 enquiries, 0 min | "never pays off", no break-even; 0.0 h; €0; switching 0.8 min; does not pay off |
| E5 | New way is slower | 120 enquiries, −2 min, minutes labelled `measured` | "never pays off"; "adds 4.0 hours of work a month" (€180 of staff time); label demo (weakest) |
| E6 | No costs | running €0, setup €0, 120 enquiries, 5 min | "pays off from the first enquiry" (break-even 0); switching 0.0 → "any net saving pays off"; 10.0 h |
| E7 | No enquiries | enquiries 0 / 0 / 0, 5 min | break-even 19; does not pay off; 0.0 h; €0; no switching value ("no enquiries") |
| E8 | Label inheritance | all inputs `company-supplied`, minutes `measured`, payback left at default | label `assumption`; after setting payback as `company-supplied` → label `company-supplied` |
| E9 | Exactness | hourly €33.33, 7 min, 100 enquiries, running €0, setup €0 | value per enquiry exactly 3.8885; 11.6 h (exact 11.666…); €388 (exact 388.85, rounded down) |
| E10 | Invalid input | low > expected; hourly €0; running −€1; payback 0; enquiries 12.5; any NaN | each rejected with an error naming the field; no output |

Properties (fast-check), for any valid input:

- break-even never rises when net minutes rise and everything else stays fixed;
- hours freed never fall when enquiries rise (net minutes > 0);
- the result label is always the weakest input label;
- displayed benefits never exceed the exact value; displayed thresholds never fall below it;
- no output is NaN or Infinity.

## Failure boundaries

- No float arithmetic on money; no output without a label; staff-time value never shown without "not cash saved".
- Invalid input never produces a partial result.
- The plain page is temporary: browser-default styling, a visible "temporary, design comes later" line, no design
  tokens, nothing stored.

## Scope

- **Skeleton:** Vite + React + TypeScript + Vitest at current versions, reusing the topsim-copilot setup (research W2).
  Scripts: `test` (`tsc --noEmit && vitest run`), `dev`, `build`, `mutate` (Stryker). `.gitignore` covers
  `node_modules`, `dist`, Stryker output. New dependencies only: react, react-dom, decimal.js; dev: vite,
  @vitejs/plugin-react, typescript, vitest, fast-check, @stryker-mutator/core, @stryker-mutator/vitest-runner,
  @types/react, @types/react-dom. Licences checked (MIT / Apache-2.0) and `npm audit` clean before commit.
- **Calculator:** `src/calculator.ts` (types, validation, scenarios, formatting) and `src/calculator.test.ts`
  (E1–E10 plus the properties).
- **Plain page:** `index.html`, `src/main.tsx`: the inputs with their labels, the three scenarios, the switching-value
  line, "not cash saved", the temporary notice.
- **Workspace wiring:** `proofloop/node_modules` added to `~/claude/link-local-deps.sh` (dependencies live in
  `~/claude-local/proofloop`); the `proofloop` entry in `~/claude/tools/checks.json` gets `"cmd": "npm test"`.
  Both files are in the workspace repo, not this one.
- **Docs:** `CLAUDE.md` gets the commands; spec status updated.

Out of scope: design and charts (ticket 05+), persistence, the company input form (08), findings labels (07), any
network or AI.

## Done when

- [ ] `npm test` green, and the check gate runs it for proofloop.
- [ ] E1–E10 and the five properties are tests.
- [ ] `npm run mutate` score reported in the handoff; every surviving mutant fixed or justified.
- [ ] The plain page shows E1–E3 correctly with demo inputs; Henri has looked at it in the browser.
- [ ] `node_modules` is a symlink into `~/claude-local/proofloop`.
- [ ] Adversarial Codex review run; every finding fixed, rejected with a reason, or put to Henri.

## Build notes

- Build in the main checkout `~/claude/proofloop`, not an app worktree, so `link-local-deps.sh` keeps
  `node_modules` out of iCloud. Fast-forward its local `main` to `origin/main` first (it is at `f6a49b8`), then
  branch `auto/v1`.
- Reuse: `topsim-copilot/package.json` and its Vitest setup (W2); the trading-app quality standards for test layers
  and Decimal-only money (W4).

## Comments
