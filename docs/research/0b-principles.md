# Step 0b lane: principles (20261026)

Lane report from a `researcher` subagent (claude-sonnet-5-5), kept as delivered. The condensed picks are in
`docs/spec.md` under `## Research`. Marks: "(sec.)" = secondary source only; "unverified" = could not check.
Not legal advice.

## Table

| Candidate | Consequence for Proofloop | Access / cost | Maturity | Verdict | Source |
|---|---|---|---|---|---|
| WCAG 2.2 form criteria (3.3.2, 1.3.5, 2.5.8, 4.1.2) | Passively checkable: accessible name per field, required marking, `autocomplete` tokens, 24x24 CSS px targets (with spacing exception). 3.3.1/3.3.3/3.3.7 need typing or submission → report "not assessed". 3.3.8 is authentication-only (lane's inference from the Understanding page) → skip for enquiry forms | Free | Rec 20241212 | Use, the only normative layer | [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [3.3.1](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html), [3.3.8](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html) |
| NN/g form guidance, backed by Seckler et al. (N=65, 20 guidelines) | Checklist: field count, single column, persistent labels (placeholder-as-label is a defect), required/optional marked. Tag as "heuristic, general-forms evidence" | NN/g free; Seckler paper free | Whitenton 20160501; Sherwin 20140511 (rev. 20180910); CHI 2014 | Use as heuristics | [NN/g forms](https://www.nngroup.com/articles/web-form-design/), [placeholders](https://www.nngroup.com/articles/form-design-placeholders/), [Seckler](https://research.google/pubs/designing-usable-web-forms-empirical-evaluation-of-web-form-improvement-guidelines/) |
| Baymard form research | Mostly e-commerce. Inline validation cannot be observed without typing. Cite as context only | Articles free; full guidelines Premium (price unverified) | Inline validation 20240109 | Borrow | [Baymard](https://baymard.com/research-articles/inline-form-validation) |
| Core Web Vitals | LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at p75 of field data. Lighthouse cannot measure INP (TBT is a proxy). Never write "passes CWV" from a lab run | Free | Page updated 20241031 | Use | [web.dev](https://web.dev/articles/vitals) |
| Lighthouse variability doc | ~5 runs, report median and range; record version and throttling; no serverless or shared-core hosts. Latest: v13.5.0 (18 Sep, year inferred as 2026) | Free | v13.5.0 | Use | [variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md), [releases](https://github.com/GoogleChrome/lighthouse/releases) |
| HM Treasury Green Book 2026 | "Cash-releasing" means a change in income or spending, so labour-time savings are non-cash-releasing unless budgets change. Requires sensitivity analysis and switching values (break-even = switching value). Public-sector guidance; adapting it to firms is a judgment call | Free (OGL) | Updated 20260205 | Use: vocabulary and structure | [Green Book 2026](https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government/the-green-book-2026) |
| Green Book optimism-bias supplement | Apply an explicit, labelled haircut to user-entered minutes saved. Do not import its percentages (generic project-category uplifts from a 2002 Mott MacDonald study) | Free | 20130421 | Borrow principle, skip numbers | [gov.uk](https://www.gov.uk/government/publications/green-book-supplementary-guidance-optimism-bias) |
| Keystroke-Level Model (Card, Moran, Newell, CACM 23:396–410, 1980) | Only for modelling the manual baseline; predicts error-free expert time, so it cannot replace recorded tests with review and correction. Paper not opened; operator times unverified | ACM paywall | 1980 | Borrow | [KLM summary (sec.)](https://www.computerhistory.org/collections/catalog/102786305) |
| Sauro & Lewis small-N statistics (CHI 2010; book 2nd ed. 2016) | Geometric mean with log-scale t-interval for times; adjusted-Wald intervals for completion and error rates; successful-task times separate from failures; plot raw per-participant points | Book paid; MeasuringU articles free | 2016 | Use | [CHI 2010](https://measuringu.com/wp-content/uploads/2017/07/Sauro_Lewis_CHI2010.pdf), [adjusted Wald](https://measuringu.com/ci-five-steps/) |
| NN/g within-subject guidance; Nielsen on sample size | Counterbalance condition order; learning carries over, so use matched but different case sets (lane's inference). ≥20 users for quantitative statistics, so N≈6–10 is descriptive only | Free | Budiu 20230710; Nielsen 20120603 | Use | [within/between](https://www.nngroup.com/articles/between-within-subjects/), [Nielsen](https://www.nngroup.com/articles/how-many-test-users/) |
| Kohavi, Tang, Xu 2020 | Fix one primary metric (OEC) and guardrails before measuring. Borrow the discipline, not the machinery (SRM, power analysis are for online scale) | Book paid | CUP 2020 | Borrow | [Cambridge](https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/D97B26382EB0EB2DC2019A7A7B518F59) |
| METR RCT (Becker et al.) | Developers forecast 24% less time and believed 20% less, but measured time rose 19%. Supports measuring time incl. review, never asking people to estimate savings. Software domain, N=16 | Free | 20250712 (v2 20250725) | Borrow as precedent | [arXiv 2507.09089](https://arxiv.org/abs/2507.09089) |
| OWASP LLM Top 10 | 2025 verified: LLM01 Prompt Injection, LLM06 Excessive Agency. 2026 v1.0 released 20260803 per OWASP; its numbering only checked via a secondary source | Free | 2026 v1.0 | Use | [2025 list](https://genai.owasp.org/llm-top-10/), [2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/), [CSA (sec.)](https://labs.cloudsecurityalliance.org/research/csa-research-note-owasp-genai-top10-2026-agent-control-stand/) |
| Prompt-injection architecture (Beurer-Kellner et al.; NCSC) | The analysis model gets no tools, no network, no secrets; returns schema-validated JSON that deterministic code checks. Assume the LLM can be confused | Free | arXiv 2506.08837 (Jun 2025); NCSC 20251208 | Use | [patterns](https://arxiv.org/abs/2506.08837), [NCSC](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection) |
| SSRF controls (OWASP cheat sheet, RFC 4291, IANA registry) | Allow-list; resolve the host, check the IPs, connect only to validated addresses; no redirects or re-validate every hop; block v4 and v6 incl. `::ffff:0:0/96` and `169.254.169.254` (write explicit tests, the cheat sheet does not cover IPv4-mapped). For the browser worker, enforce at an egress proxy or firewall (lane's inference) | Free | IANA v4 registry 20251009 | Use | [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html), [RFC 4291](https://www.rfc-editor.org/rfc/rfc4291.html), [IANA](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml) |
| Attribution (Rashkin et al. AIS; Gao et al. ALCE; Li et al. AttributionBench) | Two layers per claim: (a) deterministic: evidence ID exists, quote or measurement matches; (b) support: evidence entails the claim, scored against a human-labelled gold set. ALCE: best models lacked complete citation support ~50% of the time on ELI5; AttributionBench: fine-tuned GPT-3.5 ~80% macro-F1 | Free | CL 49(4) Dec 2023; EMNLP 2023; arXiv 20240223 | Use AIS as rubric; borrow ALCE metrics | [AIS](https://aclanthology.org/2023.cl-4.2/), [ALCE](https://arxiv.org/abs/2305.14627), [AttributionBench](https://arxiv.org/abs/2402.15089) |
| LLM-as-judge (Zheng et al.), eval-set design (Anthropic docs, BIPIA, Greshake) | Judge with a different model family; randomise order; report judge-vs-human agreement on our own set. Hostile-page cases pass only if no embedded instruction is followed and the finding is still correct. BIPIA: every tested model was vulnerable | Free | NeurIPS 2023 D&B; KDD 2025; arXiv 20230223 | Use | [Zheng](https://arxiv.org/abs/2306.05685), [Anthropic](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests), [BIPIA](https://arxiv.org/abs/2312.14197), [Greshake](https://arxiv.org/abs/2302.12173) |
| Lead-response studies (HBR 2011; 2007 MIT/InsideSales deck) | Not a numeric assumption. HBR figures only seen in secondary summaries; the 2007 deck is vendor-linked, not peer-reviewed; observational, no replication found. Can motivate asking the company for its own response times; cannot justify a conversion or revenue range (the brief forbids that anyway) | HBR paywalled | HBR 20110301 | Skip as input | [BYU record](https://scholarsarchive.byu.edu/facpub/9711), [critique (sec.)](https://ainora.lt/blog/lead-response-time-statistics-every-study-2026) |
| GDPR + EDPB | Redact or discard staff names and photos before persisting; retention TTL; keep only the form region where possible. Sending page content to an LLM API creates a processor relationship (Art. 28) and possibly a Chapter V transfer: prefer an EU endpoint with a DPA (Art. 28/Ch. V not re-verified). Art. 5(1)(c),(e) and 25 support minimisation; Art. 14(5)(b) limits the notice duty. EDPB Guidelines 03/2026 (draft, web scraping for generative AI, consultation to 20261030) relevant by analogy only | Free | GDPR 2016/679; EDPB draft v1.0 | Use | [Art 5](https://gdpr-info.eu/art-5-gdpr/), [Art 14](https://gdpr-info.eu/art-14-gdpr/), [Art 25](https://gdpr-info.eu/art-25-gdpr/), [EDPB](https://www.edpb.europa.eu/public-consultations/guidelines-032026-on-web-scraping-in-the-context-of-generative-ai_en) |
| RFC 9309; §44b UrhG; §5 DDG | robots.txt is "not a form of access authorization": 5xx → assume disallow, 4xx → unavailable, cache ≤24 h. Honour it as policy, not legal clearance. §44b(3) UrhG: reservation effective only if machine-readable. The Impressum (§5 DDG) puts representatives' names on German sites, so expect personal data on contact pages. ToS enforceability unverified | Free | RFC Sep 2022 | Use | [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html), [§44b](https://www.gesetze-im-internet.de/urhg/__44b.html), [§5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html) |
| Destatis labour cost per hour | Citable default for the fictional hourly cost: EUR 45.00 (2025 estimate extrapolated from the 2020 survey; all sectors, not role-specific) | Free | 20260429 | Use as labelled default | [Destatis](https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/04/PD26_148_624.html) |
| Chart guidance (Apple HIG Charts; WCAG 1.4.11; W3C complex images; UK Analysis Function) | One message per chart; don't rely on colour; critical values visible without interaction; meaningful graphics ≥3:1 contrast or labelled values; data table or long description beside each chart; the PDF mirrors the accessible HTML report | Free | HIG 20220923; UK guidance 20220519 | Use | [HIG](https://developer.apple.com/design/human-interface-guidelines/charts), [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [complex images](https://www.w3.org/WAI/tutorials/images/complex/), [UK](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/) |

## Pitfalls

- A lab Lighthouse run is not a Core Web Vitals result. [web.dev](https://web.dev/articles/vitals)
- Lighthouse scores swing with A/B tests, ads, extensions and shared hardware; the 5-run median is about twice as
  stable as one run. [variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md)
- Behavioural form checks (error text, inline validation, redundant entry) need input or submission; guessing them
  would break the "never submit" rule. [3.3.1](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- Treating released hours as savings: the Green Book's cash-releasing test is a change in income or expenditure.
  [Green Book](https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government/the-green-book-2026)
- Perceived speedups mislead: METR found a 20% believed gain against a measured 19% loss.
  [arXiv](https://arxiv.org/abs/2507.09089)
- Small-N task times are skewed and the sample median is biased: geometric mean with intervals, failed attempts
  separate. [Sauro & Lewis](https://measuringu.com/wp-content/uploads/2017/07/Sauro_Lewis_CHI2010.pdf)
- Prompt injection has no known complete fix and deny-lists are bypassable: contain the model instead of detecting
  attacks. [OWASP LLM01](https://genai.owasp.org/llmrisk/llm01-prompt-injection/),
  [NCSC](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection)
- Domain allow-listing alone does not stop DNS rebinding; redirects can bypass input validation.
  [OWASP SSRF](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- An LLM judge has position, verbosity and self-preference biases; automatic attribution scoring is hard even when
  fine-tuned. [Zheng](https://arxiv.org/abs/2306.05685), [AttributionBench](https://arxiv.org/abs/2402.15089)
- The "100x / 21x" lead statistics come from the 2007 MIT/InsideSales deck, not HBR, and are often misattributed
  (sec.). [critique](https://ainora.lt/blog/lead-response-time-statistics-every-study-2026)

## Open questions (for Henri / the grill)

1. Are live audits limited to owned or consented domains? That sets the GDPR Art. 14 / legitimate-interest burden
   and removes the ToS question.
2. Which LLM provider and region, with what DPA? Decides whether raw screenshots may leave our infrastructure or
   only redacted text.
3. What N is acceptable for human tests, and what threshold counts as "failure"? Fix before testing; below N=20 the
   result is descriptive.
4. What explicit haircut should the calculator apply to user-entered minutes saved? No empirical uplift exists for
   admin workflows, so any value is a labelled judgment.
5. Should response-time evidence appear at all, e.g. only as an optional company-entered metric?
6. Which OWASP edition to cite: 2025 (IDs verified) or 2026 v1.0 (numbering only via a secondary source)?

## Could not verify

Full HBR 2011 methods; the original KLM paper; the EDPB 03/2026 PDF text; Lighthouse v13 scoring weights (the doc
read lists the v10 table); PDF/UA requirements; ToS enforceability in Germany; GDPR Art. 28 and Chapter V wording;
Baymard Premium price.
