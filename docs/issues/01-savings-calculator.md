# 01 Savings calculator + project skeleton

Status: ready-for-agent (Henri OK'd the spec and this ticket, 20261027; the pivot revision, 20261028)
Model: main session (money logic is an adversarial-review trigger, so a hard slice)
Review: `tools/review.sh docs/issues/01-savings-calculator.md --repo <proofloop> --adversarial`
Spec: `docs/spec.md` (grill Q5–Q8, calculator conventions; pivot P-Q2 and pivot conventions)

## Outcome

A deterministic, tested calculator that turns labelled inputs about one process into break-even, hours freed,
staff-time value, costs, three scenarios (low / expected / high) and a switching value. The calculator counts
**cases per month**; the sentences name the case with the process noun ("enquiries" for the broker demo). Plus a
temporary plain page to try it, and the project skeleton with its check command. No styling, no network, no AI.

Pivot change (20261028): the paused work is kept and adapted, not redone. `enquiries` becomes `cases`, the display
noun moves into `describe`, and nothing else in the arithmetic changes.

## Inputs

Every input is `{ value, label }`, label ∈ `demo | assumption | company-supplied | measured` (weakest first).

| Input | Shape | Rule |
|-------|-------|------|
| Cases per month | low / expected / high | Whole numbers ≥ 0, low ≤ expected ≤ high |
| Net minutes saved per case (after review and corrections) | low / expected / high | Any number, may be negative; low ≤ expected ≤ high |
| Hourly staff cost (€) | single | > 0 |
| Running cost per month (€) | single | ≥ 0. Later the sum of tool prices and n8n hosting, computed by ticket 14 outside the calculator |
| Setup cost (€) | single | ≥ 0 |
| Payback period (months) | single, default 12 labelled `assumption` | Whole number ≥ 1 |

Display noun: `describe(scenario, noun)` takes `{ one, many }` (e.g. `{ one: "enquiry", many: "enquiries" }`),
default `{ one: "case", many: "cases" }`. It changes wording only, never a number.

## Outputs (per scenario)

| Output | Formula | Display rounding |
|--------|---------|------------------|
| Monthly cost | running + setup ÷ payback months | € up |
| Value per case | net minutes ÷ 60 × hourly cost | — |
| Break-even cases | ⌈monthly cost ÷ value per case⌉; none ("never pays off") if value per case ≤ 0; 0 → "pays off from the first <one>" | up |
| Pays off | cases ≥ break-even | — |
| Hours freed per month | cases × net minutes ÷ 60; negative → "adds X hours of work a month" | 1 decimal, down |
| Staff-time value per month | hours freed × hourly cost, always shown with "not cash saved" | € down |
| Switching value | monthly cost ÷ (cases × hourly cost ÷ 60): "still pays off as long as it saves at least X minutes per <one>"; none if cases = 0 | 1 decimal, up |
| Label | weakest label among the inputs used | — |

Low pairs low minutes with low cases, expected with expected, high with high. All arithmetic in decimal.js;
rounding happens only when formatting for display. A count of exactly 1 uses the singular noun ("1 enquiry").

## Acceptance examples

Common inputs unless stated: hourly €45, running €10/month, setup €720, payback 12 months (monthly cost €70), all
labelled `demo`, noun `{ one: "enquiry", many: "enquiries" }`.

| # | Case | Inputs | Expected |
|---|------|--------|----------|
| E1 | Expected (worked example) | 120 cases, 5 min | value per case €3.75; break-even 19 ("Pays off from 19 enquiries a month"); pays off; 10.0 h; €450 "not cash saved"; switching 0.8 min ("… per enquiry"); label demo |
| E2 | Low | 80 cases, 3 min | break-even 32; pays off; 4.0 h; €180; switching 1.2 min |
| E3 | High | 160 cases, 7 min | break-even 14; pays off; 18.6 h (exact 18.67, rounded down); €840; switching 0.6 min |
| E4 | No net saving | 120 cases, 0 min | "never pays off", no break-even; 0.0 h; €0; switching 0.8 min; does not pay off |
| E5 | New way is slower | 120 cases, −2 min, minutes labelled `measured` | "never pays off"; "adds 4.0 hours of work a month" (€180 of staff time); label demo (weakest) |
| E6 | No costs | running €0, setup €0, 120 cases, 5 min | "pays off from the first enquiry" (break-even 0); switching 0.0 → "any net saving pays off"; 10.0 h |
| E7 | No cases | cases 0 / 0 / 0, 5 min | break-even 19; does not pay off; 0.0 h; €0; no switching value ("no enquiries") |
| E8 | Label inheritance | all inputs `company-supplied`, minutes `measured`, payback left at default | label `assumption`; after setting payback as `company-supplied` → label `company-supplied` |
| E9 | Exactness | hourly €33.33, 7 min, 100 cases, running €0, setup €0 | value per case exactly 3.8885; 11.6 h (exact 11.666…); €388 (exact 388.85, rounded down) |
| E10 | Invalid input | low > expected; hourly €0; running −€1; payback 0; cases 12.5; any NaN | each rejected with an error naming the field; no output |
| E11 | Display noun | (a) E1 with no noun; (b) E1 with `{ one: "booking", many: "bookings" }`; (c) running €0, setup €3, payback 1, 5 min, 1 case | (a) "Pays off from 19 cases a month"; (b) "Pays off from 19 bookings a month", "… per booking"; (c) break-even 1: "Pays off from 1 enquiry a month", "Pays off at 1 enquiry a month", switching 4.0 min; numbers identical across (a) and (b) |

Properties (fast-check), for any valid input:

- break-even never rises when net minutes rise and everything else stays fixed;
- hours freed never fall when cases rise (net minutes > 0);
- the result label is always the weakest input label;
- displayed benefits never exceed the exact value; displayed thresholds never fall below it;
- no output is NaN or Infinity;
- for any two nouns, `describe(s, a)` and `describe(s, b)` contain the same numbers and differ only in the noun words.

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
  (E1–E11 plus the properties).
- **Plain page:** `index.html`, `src/main.tsx`: the inputs with their labels, the three scenarios, the switching-value
  line, "not cash saved", the temporary notice; noun "enquiries" for the broker demo.
- **Workspace wiring:** `proofloop/node_modules` added to `~/claude/link-local-deps.sh` (dependencies live in
  `~/claude-local/proofloop`); the `proofloop` entry in `~/claude/tools/checks.json` gets `"cmd": "npm test"`.
  Both files are in the workspace repo, not this one.
- **Docs:** `CLAUDE.md` gets the commands; spec status updated.

Out of scope: design and charts (08, 16, 18), tool prices into running cost (14), the intake adapter into the
ranges (04), findings (15), persistence, any network or AI.

## Done when

- [ ] `npm test` green, and the check gate runs it for proofloop.
- [ ] E1–E11 and the six properties are tests.
- [ ] `npm run mutate` score reported in the handoff; every surviving mutant fixed or justified.
- [ ] The plain page shows E1–E3 correctly with demo inputs; Henri has looked at it in the browser.
- [ ] `node_modules` is a symlink into `~/claude-local/proofloop`.
- [ ] Adversarial Codex review run; every finding fixed, rejected with a reason, or put to Henri.

## Build notes

- Planned for the main checkout `~/claude/proofloop`; the build session ended up in the app worktree
  `.claude/worktrees/whats-next-ff6ccc` on `auto/v1`, where its uncommitted work now is (`node_modules` there is
  already a symlink into `~/claude-local/proofloop`). Finish it there; the spec and research docs land as their own
  commit first.
- Reuse: `topsim-copilot/package.json` and its Vitest setup (W2); the trading-app quality standards for test layers
  and Decimal-only money (W4).

## Comments
