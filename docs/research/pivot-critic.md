# Pivot research: completeness critic (20261028)

A separate `researcher` agent read all four lanes and their fact-checks and listed what is missing.

## Completeness critique (20261028)

Checked against `/Users/henri/Library/Mobile Documents/com~apple~CloudDocs/Claude/proofloop/.claude/worktrees/whats-next-ff6ccc/docs/spec.md` (pivot section, lines 12-45).

**Contradictions between lanes and the spec**
- **Licence severity.** Capability lane: "fine, Proofloop does not host". Prior-art lane: pushing workflows into a client's n8n, or building for outsiders "through an AI agent", is a grey zone (https://support.n8n.io/article/can-i-use-your-license-for-my-use-case). Spec P-Q3 plans AI-drafted workflows later. Nobody has asked license@n8n.io.
- **Tool gate.** Spec P-Q4 requires an "official n8n integration". Lane 2 shows no official node for Lexware, sevDesk, DATEV, Tally or DocuSign. Calendly, Cal.com, Typeform and Jotform are trigger-only. The gate has to be redefined with the five levels, or the German SME tool list is nearly empty.
- **EU data rule.** P-Q4 also requires "a way to keep data in the EU". Claude has no EU-pinned option (lane G3), so Proofloop's own AI rung fails its gate. No lane researched an EU-capable LLM route. Insurance enquiries can contain Art. 9 health data.
- **"Tested" blueprints.** Spec P-Q3 and W6 use local n8n 2.43.8. Stable is 2.45.5, and 3.0 is a pre-release that changes imports. No lane says how to test Gmail, CRM or Lexware nodes without real accounts, or whether blueprints survive version changes (unverified).

**Missing questions**
- **Website value after the pivot.** Detected tools are only front-end embeds. The fictional site is written by Henri, so detection tests on it are circular. No lane tests whether the audit adds anything beyond the intake.
- **No user evidence.** No source shows that a German broker or SME owner will fill in the intake.
- **Regulation of the demo domain.** Nothing on broker rules (§34d GewO, IDD, unverified) or on UWG §7 consent for the follow-up step in P-Q2. Neither appears in any lane.
- **Running cost of n8n.** Nothing on hosting, upgrade and monitoring effort, or on executions per case against the Cloud caps (2.5K and 10K). The break-even formula needs these.
- **Measured "after" data.** n8n Insights has a user-entered "Time saved" setting. It shows executions, failures, failure rate and average run time. The summary banner is on all plans. The dashboard needs Cloud Pro or Business. Self-hosted retention is 365 days (https://docs.n8n.io/insights/, read 20261028). No lane covers it. It is worth borrowing for validation, but the time saved is self-entered, not measured.
- **Sources read second-hand.** The n8n pricing, webhook and queue-mode pages were read through a summariser. The CJEU SCHUFA judgment, the Dumas book and the BMWE release were never read directly. The n8n Cloud DPA and region are unconfirmed.
- **Measured-label threshold.** Spec P5 says below N=20 is descriptive only. The Six Hats section plans 6-10 test participants (spec line ~342). "Measured" may never be reachable.
- **Spec gap.** Line 45 says "small scale, then bigger" is answered in P-Q6, but P-Q6 is not written.

**The 5 facts most likely to change scope**
1. n8n's answer on whether AI-drafted or pushed workflows need a commercial licence. A yes cuts "any process" to blueprints only.
2. Whether the tool gate counts HTTP-Request-only and community nodes. This sets the vetted tool list and the German finance coverage.
3. An EU-compliant LLM route, plus the n8n Cloud DPA and region. Without them, AI rungs are barred for insurance enquiries.
4. What "tested blueprint" means in practice: mocked credentials, a pinned n8n version, and whether 3.0 breaks imports.
5. Whether real SMEs supply the intake, and whether the website audit still earns its place.

**Questions for Henri**
- Is "whole companies, small scale first" meant as more processes or more audit depth (the unwritten P-Q6)?
- Which of the five facts do you want researched next?
