# Proofloop

Evidence-based audits of one public website journey: **enquiry → qualification → appointment or quote
request**.

Proofloop looks at what a company's website actually shows, links every finding to its evidence, and works out
whether a fix needs a UX change, a simple automation, an integration, AI, or nothing at all. Savings are
calculated from visible, labelled inputs, never guessed from a website.

Website audits, analytics and automation assessments already exist. Proofloop's aim is better evidence and
clearer reasoning, not a new product category.

> **Status:** planning, October 2026. No code yet: the brief, spec and tickets are worked out in the open in this
> repository. First complete version due January 2027.

## What it answers

1. What can we actually observe?
2. What improvement does that observation suggest?
3. Simpler software, automation, AI, or no change?
4. What extra information would establish the business case?
5. How would we test whether the improvement works?
6. What happened when we tested it?

## Planned features

The spec is still being settled, so details will change.

- **Evidence collection** for up to five approved public pages: page text, screenshots, URLs, timestamps and
  performance measurements (Playwright, Lighthouse). Failed checks and missing pages are shown, not hidden.
- **At most three priority findings**, each linked to its evidence and labelled as observed fact, hypothesis,
  estimate or measured result.
- **A transparent savings calculator**: hours released, break-even point, costs and sensitivity, with every
  assumption visible and every fictional input labelled. Hours released are not counted as cash saved.
- **Setup recipes** for automation findings, including importable n8n workflows.
- **Downloadable one-page reports** per finding.
- **A small validation flow**: hypothesis, one success metric, safeguards, baseline, result and limitations.
- **A demo on a fictional business** with deliberately introduced problems, including one recommendation that
  does not pay off.

## What it won't do

- Infer revenue, conversion losses or staff workload from a website alone.
- Submit forms, sign in, buy anything or change a third-party site.
- Let website content steer the analysis model.

## In this repository

- [`BRIEF.md`](BRIEF.md): the original requirements, verbatim.
- [`docs/spec.md`](docs/spec.md): the spec in progress (ideas, research, decisions).
- [`CLAUDE.md`](CLAUDE.md): rules for the AI agents that build this project.
  [how-i-build](https://github.com/henribauer/how-i-build) explains the workflow behind them.
