# Proofloop — Henri's brief (verbatim, 20261026)

This is the original requirement text. The spec (`docs/spec.md`) separates these
requirements from Claude's proposed assumptions; when the two disagree, this file wins until Henri
decides otherwise.

---

Build a portfolio-quality web application called Proofloop — an evidence-based tool that helps companies identify and validate improvements to their websites, digital services, and business workflows using better UX, software integrations, automation, and AI.

## My background and goal

I study International Business Administration and want to pursue a career in fintech product development and strategy. My philosophy is to use data and measurable outcomes to improve decisions.

This project should demonstrate business judgment, product thinking, technical execution, and honest evaluation. It needs to be something I can confidently demonstrate and discuss in job interviews.

I currently have no access to a company's internal data. Start with public websites and clearly labelled demo data. Do not use anything related to WMP.

## Working approach

Read the applicable CLAUDE.md, AGENTS.md, and relevant workspace skills first. Follow their planning, design, testing, and independent review requirements.

Inspect existing projects and implementation notes for reusable patterns. Choose the smallest complete implementation.

Present a concise scope and implementation plan before coding. Clearly distinguish my requirements from your proposed assumptions. Ask only questions that materially affect scope, cost, or safety, while respecting any mandatory workspace approval gates.

Once the required approvals are satisfied, implement the agreed scope through small, tested slices. Do not stop after producing a scaffold or attractive mockup.

## Product positioning

Proofloop should answer:

1. What can we actually observe?
2. What improvement does that observation suggest?
3. Should we use simpler software, automation, AI, or no change?
4. What additional information would establish the business case?
5. How would we test whether the improvement works?
6. What happened when we tested it?

Existing products already provide website audits, analytics, and automation assessments. Do not claim that this is a new product category. Make this project stand out through evidence quality, clear reasoning, and a convincing demonstration.

## Narrow first use case

Start with one journey:
Website enquiry → qualification → appointment or quote request.

Investigate publicly observable friction in that journey. Internal steps may only be described when supplied as explicit demo assumptions or confirmed process information.

Keep the architecture extensible, but do not build a universal enterprise audit platform.

## Core experience

### 1. Define an audit

The user supplies:

- A public website URL.
- The journey they want to investigate.
- A short business objective.
- Optional structured process assumptions.

Start with operator-approved domains and a maximum of five relevant pages per audit.

Explain what the available evidence allows the tool to assess. Never silently invent missing information.

### 2. Collect evidence

Reuse established tools such as Playwright and Lighthouse where appropriate.

Capture relevant page text, screenshots, URLs, timestamps, and technical measurements. Preserve the source and collection method.

Display failed checks, unavailable pages, and incomplete coverage explicitly.

### 3. Produce actionable findings

Show at most three priority recommendations initially.

Each finding must contain:

- A specific observation.
- Links to the evidence supporting it.
- An explanation of the possible business consequence.
- A proposed improvement.
- Whether it requires UX changes, conventional automation, integration, or AI.
- Prerequisites and missing information.
- An implementation outline.
- A transparent value scenario, where sufficient inputs exist.
- A measurement plan.

Separate observed facts, hypotheses, estimated scenarios, and measured results visibly.

The tool must be comfortable saying "insufficient evidence" or "AI is unnecessary here."

Avoid generic recommendations such as "add a chatbot" unless the evidence supports a specific use case.

### 4. Calculate potential value transparently

Use deterministic calculations, not AI-generated financial arithmetic.

For an administrative workflow:

Monthly capacity released = monthly cases × minutes saved per case ÷ 60.

Display hourly cost assumptions, recurring software costs, implementation costs, and sensitivity separately.

Released capacity is not automatically cash savings.

Never infer revenue, conversion losses, staff workload, or financial returns from a website alone. Label every fictional input.

### 5. Validate an improvement

Let the user select a finding and define:

- A falsifiable hypothesis.
- One primary success metric.
- Quality, error, and cost safeguards.
- The baseline and comparison method.
- The result and limitations.

Do not build a full experimentation platform. Reuse suitable tools or implement a small, task-specific measurement flow.

## The demonstration that makes the project convincing

Create an original fictional business and an owned demo journey with realistic, deliberately introduced problems.

The complete demonstration should show:

Evidence → finding → proposed change → implemented improvement → measured comparison.

For example, compare manual handling of fictional enquiries with a structured intake and routing workflow. Use rules where rules suffice; test AI only for a task that needs it.

Measure time including review and corrections, completion, errors, and cost where applicable. Keep task difficulty comparable and document how measurements were collected.

Seeded data can test calculations and functionality. Claims about human task performance require actual recorded tests.

Include a case where a plausible recommendation fails or AI provides no worthwhile benefit. Do not manufacture a success story.

## Interface

Use an English-language interface suitable for an international portfolio.

Prioritize:

- A concise audit overview.
- An evidence inspector.
- A finding detail view.
- A transparent business-case calculator.
- A validation and results view.

Make it easy to move from a claim to its source. Use charts only when they explain something useful.

Follow the workspace design process, including relevant Mobbin references before mockups. Ensure keyboard accessibility, readable contrast, responsive layouts, and reduced-motion support.

## Architecture and boundaries

Prefer a small TypeScript web application and existing components. Follow the workspace's hosted-web-app and Supabase requirements, including a specific EU region, appropriate access controls, and server-side secrets.

Run browser collection in a separate, restricted worker. Do not assume Chromium or reliable Lighthouse measurements belong inside an ordinary serverless request.

Public demos may use prepared audit snapshots, clearly labelled with their capture date. Live collection must be genuinely implemented and documented if presented as a feature.

Treat website content as untrusted input. Protect URL fetching against private-network access, redirect bypasses, and unsafe browser subrequests. Website instructions must never control the analysis model or expose secrets.

Do not submit forms, make purchases, access authenticated areas, modify third-party websites, or automatically implement recommendations.

Keep external API usage bounded and disclose prerequisites and operating costs.

## Acceptance criteria

The first complete version must:

- Run locally from documented instructions.
- Demonstrate the entire audit-to-validation journey.
- Support genuine evidence collection for approved public pages.
- Clearly distinguish prepared demonstrations from live analysis.
- Link every factual finding to inspectable evidence.
- Handle missing evidence and unsuccessful scans honestly.
- Reproduce financial scenarios from visible inputs.
- Include a small evaluation set covering genuine issues, harmless pages, insufficient information, and hostile page instructions.
- Verify both evidence-reference validity and whether the evidence actually supports the claim.
- Test critical URL restrictions and access controls.
- Provide a reproducible benchmark with raw results and limitations.
- Complete the applicable independent review and resolve or document findings.

## Portfolio deliverables

Provide:

- The working application.
- A polished, reliable demonstration.
- An English README explaining architecture, setup, evaluation, and trade-offs.
- An evidence-backed case study.
- A short interview demonstration script.
- A CV bullet using only results actually established; leave unmeasured outcomes as explicit placeholders.

Prepare deployment instructions, but do not publish, purchase services, or push code without the required authorization.

Deferred from version one: native apps, enterprise integrations, unrestricted crawling, autonomous modifications, and a universal optimization score.

Main risk: a public website audit cannot establish internal business problems or real financial returns; preserve that distinction throughout the product and portfolio.

---

## Amendment 20261028 (Henri, verbatim)

> i want that the project is more focused on optimizing companies with systems like n8n so i tell them what can be
> automized and how and what tools are needed. ask me if ur unclear

This amendment wins over the text above where they conflict. How it is applied is recorded in `docs/spec.md` under
"Pivot".
