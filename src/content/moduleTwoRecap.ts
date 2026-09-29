import type { DefinitionRow, LessonRecap } from "../types/lesson";

const rowException: DefinitionRow = {
  term: "Exception & Clause Hunting",
  meaning:
    "Using AI to scrutinize dense text to identify non-standard clauses, liability shifts, omitted mandatory terms, or policy deviations.",
  workplaceExample:
    "Reviewing three revised supplier service level agreements to flag a shortened warranty window from 24 months to 12 months.",
};

const rowSourceCheck: DefinitionRow = {
  term: "Source Citation & Hallucination Audit",
  meaning:
    "Enforcing strict verification rules where the AI must quote page numbers, section clauses, and exact excerpts from uploaded documents rather than extrapolating.",
  workplaceExample:
    "Prompting the model: 'For every difference listed, provide the exact page number and direct verbatim excerpt from Document A and Document B.'",
};

export const moduleTwoRecap: LessonRecap = {
  id: "module-2-recap",
  moduleId: "module-2",
  title: "Module 2 · Smart Comparison Made Easy with AI",
  durationSec: 600,
  prototypeNote: "Full production recap (~10 minutes) · Grounded in Level 1 Handbook (Smart Comparison).",
  beats: [
    {
      id: "m2-intro",
      startSec: 0,
      hudLabel: "1. Overview",
      camera: "wide",
      board: {
        kind: "titles",
        programmeLine: "Level 1 · AI Foundations & Literacy",
        moduleTitle: "Module 2 · Smart Comparison Made Easy with AI",
        lessonTitle: "Mastering the 7-Step AI Document & Data Comparison Engine",
      },
      narration:
        "Welcome to Module 2: Smart Comparison Made Easy with AI. In corporate operations, comparing multi-page contracts, revised policy versions, and financial statements can consume days of tedious manual review. In this 10-minute recap, you will learn the authoritative 7-step comparison workflow that transforms hours of manual line-by-line reading into minutes of sharp, exception-focused analysis.",
    },
    {
      id: "m2-workflow",
      startSec: 60,
      hudLabel: "2. The 7-Step Workflow",
      camera: "board",
      board: {
        kind: "processFlow",
        heading: "The 7-Step Smart Comparison Workflow (Handbook pp. 16–17)",
        steps: [
          {
            stepNumber: 1,
            title: "Data Collection",
            subtitle: "Identify all relevant documents, contract versions, invoices, or policies to compare.",
          },
          {
            stepNumber: 2,
            title: "Define Objective",
            subtitle: "Clarify specific audit goal: hunting exceptions, clause changes, or financial variances.",
          },
          {
            stepNumber: 3,
            title: "Gather Files",
            subtitle: "Clean, format, and organize PDFs, Word redlines, and spreadsheets for processing.",
          },
          {
            stepNumber: 4,
            title: "AI Comparison",
            subtitle: "Run structured side-by-side analysis using the Master Comparison Prompt.",
            highlight: true,
          },
          {
            stepNumber: 5,
            title: "Review & Validate",
            subtitle: "Scrutinize outputs and cross-examine verbatim quotes against source page citations.",
            highlight: true,
          },
          {
            stepNumber: 6,
            title: "Document Outcome",
            subtitle: "Compile verified discrepancies and variance tables into an executive decision log.",
          },
          {
            stepNumber: 7,
            title: "Take Follow-Up Action",
            subtitle: "Escalate redline risks to legal, challenge supplier cost overruns, or confirm execution.",
          },
        ],
      },
      narration:
        "Here is the authoritative 7-step comparison workflow from pages 16 and 17 of the handbook: Step 1, Data Collection. Step 2, Define Objective. Step 3, Gather Files. Step 4, AI Comparison. Step 5, Review and Validate. Step 6, Document Outcome. And Step 7, Take Follow-Up Action. This disciplined sequence ensures nothing is missed and every finding is audit-ready.",
    },
    {
      id: "m2-master-prompt",
      startSec: 130,
      hudLabel: "3. Master Comparison Prompt",
      camera: "instructor",
      board: {
        kind: "promptComparison",
        heading: "Master Prompting: Vague vs. Structured Comparison",
        weakTitle: "Weak Prompt (Yields Generic Summary)",
        weakPrompt: "Compare Document A and Document B and tell me what is different.",
        strongTitle: "Strong Master Prompt (Actionable Enterprise Matrix)",
        strongPrompt:
          "Act as a Senior Commercial Auditor. Compare [Doc A] and [Doc B]. Generate a 4-column Markdown table: [Clause / Topic], [Doc A Specification], [Doc B Specification], and [Financial / Operational Impact]. Highlight any changes in liability, payment terms, or delivery SLAs in bold. If a clause is unchanged, omit it. Quote exact page numbers.",
      },
      narration:
        "Notice the dramatic difference between a novice prompt and a professional master prompt. A weak prompt merely produces a vague narrative summary. A strong master prompt assigns an auditor role, defines a precise 4-column matrix, commands the AI to omit identical items, and forces exact page citations for total verification.",
    },
    {
      id: "m2-multi-doc",
      startSec: 200,
      hudLabel: "4. Multi-Document Review",
      camera: "board",
      board: {
        kind: "scorecardTable",
        heading: "3-Way Tenancy Agreement Reconciliation Matrix (JLG & Handbook p. 19)",
        headers: ["Clause / Section", "File A (Internal Draft)", "File B (Counterparty Rev)", "File C (Signed Copy)", "Variance & Risk Notes"],
        rows: [
          {
            cells: [
              "Security Deposit",
              "3 months gross rent (RM 45,000)",
              "Reduced to 2 months (RM 30,000)",
              "3 months with bank guarantee option",
              "Counterparty attempted reduction; final reinstated 3 months with BG.",
            ],
            highlight: "amber",
          },
          {
            cells: [
              "Premises Handover",
              "14 days fit-out rent-free",
              "Extended to 30 days rent-free",
              "21 days rent-free agreed",
              "Negotiated operational compromise approved by leasing team.",
            ],
            highlight: "amber",
          },
          {
            cells: [
              "Subletting Restriction",
              "Strict prohibition without written consent",
              "Permitted to group affiliates",
              "Omitted entirely in counterparty redline!",
              "HIGH RISK: Unapproved omission exposes building to unauthorized subtenancy.",
            ],
            highlight: "red",
          },
          {
            cells: [
              "Governing Law",
              "Courts of Malaysia, Kuala Lumpur",
              "Singapore Arbitration Centre (SIAC)",
              "Courts of Malaysia, Kuala Lumpur",
              "Compliant: Corporate jurisdiction preserved as required by Legal SOP.",
            ],
            highlight: "green",
          },
        ],
        note: "Handbook Rule: Require side-by-side matrices with verbatim clause quotes to catch stealth deletions.",
      },
      narration:
        "When comparing multiple versions of a contract—such as internal drafts, counterparty redlines, and signed execution copies—AI side-by-side tables catch changes that tired human eyes miss. Notice row 3: the counterparty quietly deleted the subletting prohibition clause entirely. A structured prompt immediately flagged this omission as a high-risk redline before execution.",
    },
    {
      id: "m2-variance",
      startSec: 280,
      hudLabel: "5. Variance Analysis",
      camera: "board",
      board: {
        kind: "kpiVariance",
        heading: "Quantitative Variance Analysis: Marketing Overspend Audit",
        metrics: [
          {
            label: "Approved Budget",
            value: "RM 250k",
            delta: "Base FY26",
            deltaType: "neutral",
            subtext: "Board approved allocation",
          },
          {
            label: "Actual Spend",
            value: "RM 295k",
            delta: "+RM 45,000 Overspend",
            deltaType: "warning",
            subtext: "Invoiced across 4 vendors",
          },
          {
            label: "Variance %",
            value: "+18.0%",
            delta: "Unfavorable",
            deltaType: "warning",
            subtext: "Exceeds 5% tolerance",
          },
          {
            label: "Audit Exceptions",
            value: "3 Invoices",
            delta: "Policy Violation",
            deltaType: "warning",
            subtext: "Unapproved scope change",
          },
        ],
        narrativeTitle: "Root-Cause Variance Isolation (Handbook p. 19 Cluster B)",
        narrativeText:
          "The AI comparison reconciled the general ledger against vendor statements, isolating two unbudgeted social media blitzes (RM28,000) and an unnegotiated agency retainer hike (RM17,000). By prompting for percentage deviations and root causes, the model identified the exact invoice numbers that caused the 18% cost overrun.",
      },
      narration:
        "In financial and budget analysis, quantitative variance matters immensely. Never ask the AI to simply guess totals. Prompt the model to calculate the absolute difference, the percentage variance, and to explicitly isolate root causes. Here, the AI surfaces an 18% overspend—amounting to RM 45,000—and pins down the exact unapproved invoices responsible.",
    },
    {
      id: "m2-exceptions",
      startSec: 360,
      hudLabel: "6. Exception Hunting",
      camera: "board",
      board: {
        kind: "definition",
        heading: "Catching Hidden Traps & Anomalies",
        row: rowException,
      },
      narration:
        "Exception hunting is where AI delivers peak business value. Humans get fatigued reading 80-page contracts and overlook subtle wording changes like 'may' instead of 'shall'. AI never gets tired. You can instruct the agent to act as a hawk for hidden liabilities, indemnities, and non-compete clauses, instantly surfacing deal-breaking deviations.",
    },
    {
      id: "m2-validation",
      startSec: 440,
      hudLabel: "7. Source Verification",
      camera: "instructor",
      board: {
        kind: "definition",
        heading: "The Golden Rule of AI Comparison",
        row: rowSourceCheck,
      },
      narration:
        "Remember the golden rule of AI-assisted comparison: never accept an AI finding without verifying the original page and clause citation. Always command the AI to provide exact verbatim snippets. If the model cannot point to the exact paragraph, treat the finding with skepticism until verified.",
    },
    {
      id: "m2-knowledge-check",
      startSec: 520,
      hudLabel: "8. Knowledge Check",
      camera: "board",
      board: {
        kind: "takeaway",
        heading: "Module 2 Knowledge Check",
        text: "What is the most critical technique to avoid hallucinations when comparing two 50-page vendor agreements?",
      },
      narration:
        "Let us test our understanding of AI-driven comparison with a quick scenario check.",
      knowledgeCheck: {
        question:
          "When comparing two complex commercial agreements using AI, what is the most effective way to eliminate hallucinations and guarantee audit readiness?",
        options: [
          {
            id: "a",
            label: "Ask the AI to generate a creative summary without strict formatting.",
          },
          {
            id: "b",
            label:
              "Require structured tabular output with direct verbatim quotes and exact document page citations for every identified variance.",
          },
          {
            id: "c",
            label: "Increase the temperature setting to allow the model to infer missing contractual terms.",
          },
        ],
        correctId: "b",
        confirmText:
          "Correct! Requiring side-by-side tabular formatting with verbatim quotes and exact page citations provides an indisputable audit trail and prevents hallucinations.",
      },
    },
    {
      id: "m2-takeaways",
      startSec: 570,
      hudLabel: "9. Key Takeaways",
      camera: "wide",
      board: {
        kind: "takeaway",
        heading: "Module 2 Key Takeaways",
        text: "1. Follow the 7-step comparison workflow for consistent rigor.\n2. Use structured Master Prompts specifying exact columns and criteria.\n3. Isolate variances and exceptions rather than re-reading identical clauses.\n4. Enforce verbatim quotes and page numbers for audit verification.\n5. Keep human judgment central: AI surfaces the differences, you decide the strategy.",
      },
      narration:
        "To summarize Module 2: The 7-step workflow turns document comparison into a strategic advantage. Master prompts generate actionable matrices, exception hunting flags critical risks, and strict citation requirements keep the output audit-ready. You are now prepared to move into Module 3, where we build custom AI agents for your team.",
    },
  ],
};
