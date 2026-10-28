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

- [x] `npm test` green, and the check gate runs it for proofloop.
- [x] E1–E11 and the six properties are tests.
- [x] `npm run mutate` score reported in the handoff; every surviving mutant fixed or justified.
- [x] The plain page shows E1–E3 correctly with demo inputs (checked 20261028); Henri has looked at it in the browser (20261028).
- [x] `node_modules` is a symlink into `~/claude-local/proofloop`.
- [x] Adversarial Codex review run; every finding fixed, rejected with a reason, or put to Henri.

## Build notes

- Planned for the main checkout `~/claude/proofloop`; the build session ended up in the app worktree
  `.claude/worktrees/whats-next-ff6ccc` on `auto/v1`, where its uncommitted work now is (`node_modules` there is
  already a symlink into `~/claude-local/proofloop`). Finish it there; the spec and research docs land as their own
  commit first.
- Reuse: `topsim-copilot/package.json` and its Vitest setup (W2); the trading-app quality standards for test layers
  and Decimal-only money (W4).

## Comments

20261028 — review (codex, adversarial): 1 findings → review/01-20261028-1147.md

20261028 — handoff (Claude Code, claude-opus-5-5, main session):
- Done: skeleton (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2, Vitest 5.0.5, fast-check 4.10.2, Stryker 10.1.1,
  decimal.js 10.6.0, exact pins); `src/calculator.ts` with the pivot revision (cases, `describe(s, noun)`);
  `src/calculator.test.ts`: E1–E11, the six properties against a BigInt-fraction oracle, 49 tests green;
  plain page `index.html` + `src/main.tsx` (noun "enquiries"), E1–E3 checked in the browser; CLAUDE.md commands;
  spec status line; `.claude/launch.json` (`proofloop-dev`).
- Mutation: 98.77 % (161 killed, 1 runtime error counted as killed, 2 survived). Both survivors are equivalent:
  the `[]` that `fail` returns is discarded once an error exists, and the `netMinutes` rule message is never
  shown because that rule never fails.
- Deviation, put to Henri: inputs must be below 1,000,000,000,000 and have at most 4 decimal places. Without a
  bound, decimal.js rounds long products before display rounding and can overstate a benefit (hourly 0.999… with
  41 nines shows €1 of staff time), which breaks "displayed benefits never exceed the exact value". With the
  bound every product fits in 48 digits, precision is 60, and the oracle property runs up to the limits.
- Review: `review/01-20261028-1147.md`, 1 finding [P1]: exactly this deviation. Disposition: put to Henri.
- Licences: direct dependencies MIT / Apache-2.0; dev-only transitive lightningcss (MPL-2.0) and caniuse-lite
  (CC-BY-4.0) via Vite. `npm audit`: 0 after `overrides: { qs: 6.17.0 }` (Stryker → typed-rest-client pins qs 6.15.1).
- Stryker + TypeScript 7: `tsconfigFile` points at a missing file so Stryker skips its tsconfig rewrite, which
  needs the TypeScript JS API that TypeScript 7 no longer ships (see the comment in `stryker.config.mjs`).
- Next: Henri decides the bound, looks at the page, confirms the commit; then commit on `auto/v1` and push it.
- Uncommitted here: `.gitignore`, `CLAUDE.md`, `docs/spec.md`, this ticket, `docs/review/01-20261028-1147.md`,
  `.claude/launch.json`, `index.html`, `package.json`, `package-lock.json`, `src/`, `stryker.config.mjs`,
  `tsconfig.json`, `vite.config.ts`. Workspace repo (Henri decides): `~/claude/link-local-deps.sh`
  (`proofloop/node_modules` line), `~/claude/tools/checks.json` (`"cmd": "npm test"`).

20261028 — Henri: keep the input bound (review finding [P1] resolved: kept by decision); looked at the page; commit
and push `auto/v1` approved. Workspace files (`link-local-deps.sh`, `checks.json`) not decided yet.
