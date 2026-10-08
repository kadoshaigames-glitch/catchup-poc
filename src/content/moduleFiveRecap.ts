import type { DefinitionRow, LessonRecap } from "../types/lesson";

const rowOptOut: DefinitionRow = {
  term: "Zero Data Retention & Enterprise Tenancy",
  meaning:
    "Enterprise agreements where AI model providers contractually guarantee that corporate customer prompts and uploaded files are never used to train base foundation models.",
  workplaceExample:
    "Using Microsoft 365 Copilot with commercial data protection enabled rather than a personal public ChatGPT account to draft board memos.",
};

export const moduleFiveRecap: LessonRecap = {
  id: "module-5-recap",
  moduleId: "module-5",
  title: "Module 5 · AI Ethics, Privacy and Security at Work",
  durationSec: 600,
  prototypeNote: "Full production recap (~10 minutes) · Grounding AI in corporate governance, Malaysia AIGE 2024 guidelines, and PDPA 2024 amendments.",
  beats: [
    {
      id: "m5-intro",
      startSec: 0,
      hudLabel: "1. Overview",
      camera: "wide",
      board: {
        kind: "titles",
        programmeLine: "Level 1 · AI Foundations & Literacy",
        moduleTitle: "Module 5 · AI Ethics, Privacy and Security at Work",
        lessonTitle: "Establishing Corporate Guardrails, Legal Compliance, and Safe AI Habits",
      },
      narration:
        "Welcome to Module 5: AI Ethics, Privacy and Security at Work. Speed without safety leads to catastrophe. When employees paste confidential customer records or trade secrets into public AI tools, companies face massive regulatory fines and reputational ruin. In this 10-minute recap, you will master the ethical, legal, and operational guardrails required for responsible enterprise AI use.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-5/intro.mp3`,
    },
    {
      id: "m5-pillars",
      startSec: 60,
      hudLabel: "2. The 5 Ethical Pillars",
      camera: "board",
      board: {
        kind: "layers",
        heading: "The 5 Pillars of Enterprise AI Governance",
        layers: [
          "1. Transparency: Clear disclosure when AI generates content",
          "2. Fairness: Actively testing for and mitigating demographic bias",
          "3. Accountability: Humans remain legally and ethically responsible",
          "4. Privacy & Data Protection: Strict compliance with PDPA & GDPR",
          "5. Reliability & Safety: Rigorous verification against hallucinations",
        ],
      },
      narration:
        "Responsible corporate AI rests on five non-negotiable pillars: Transparency, Fairness, Accountability, Privacy, and Reliability. Notice Pillar 3: Accountability always remains with the human professional. You can never blame an algorithm for an erroneous or non-compliant business decision.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-5/pillars.mp3`,
    },
    {
      id: "m5-aige-framework",
      startSec: 130,
      hudLabel: "3. Malaysia AIGE & PDPA 2024",
      camera: "board",
      board: {
        kind: "scorecardTable",
        heading: "Malaysia Regulatory Matrix: AIGE 2024 Ethics vs. PDPA 2024 Law",
        headers: ["Governance Dimension", "Malaysia AIGE 2024 (Ethics)", "PDPA 2024 Amendments (Statute)", "Workplace Compliance Rule"],
        rows: [
          {
            cells: [
              "Legal Force",
              "Voluntary National Framework",
              "Mandatory Statutory Legislation",
              "Mandatory: Breaches incur legal penalties under amended PDPA.",
            ],
            highlight: "green",
          },
          {
            cells: [
              "Data Protection Officer",
              "Recommended ethical oversight lead",
              "Mandatory DPO appointment for designated classes",
              "Designate internal compliance owner before rolling out agents.",
            ],
            highlight: "amber",
          },
          {
            cells: [
              "Breach Notification",
              "Voluntary transparency disclosure",
              "Mandatory 72-hour regulatory notification clock",
              "Immediate escalation required if PII is pasted into AI prompts.",
            ],
            highlight: "red",
          },
          {
            cells: [
              "Statutory Penalties",
              "Reputational loss and audit review",
              "Up to RM 1,000,000 fine / 3 years imprisonment",
              "Enforce enterprise zero-retention accounts; prohibit free consumer AI for PII.",
            ],
            highlight: "red",
          },
        ],
        note: "Legal Principle: AIGE guides ethical development; PDPA 2024 imposes binding corporate criminal and civil liability.",
      },
      narration:
        "In Malaysia, governance is anchored by two frameworks: the National AI Governance and Ethics guidelines issued in 2024, and the landmark 2024 amendments to the Personal Data Protection Act. While AIGE sets ethical benchmarks for fairness and transparency, the PDPA amendments carry binding statutory weight—including mandatory DPOs, strict 72-hour breach reporting, and fines up to RM 1,000,000.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-5/aige-framework.mp3`,
    },
    {
      id: "m5-data-handling",
      startSec: 220,
      hudLabel: "4. Red Flags vs. Green Flags",
      camera: "board",
      board: {
        kind: "governanceCard",
        heading: "Corporate AI Governance Compliance Scorecard",
        redFlags: [
          {
            title: "Pasting Unredacted Customer PII",
            detail: "Entering employee NRICs, payroll, bank accounts, or patient records into public or free AI chatbots.",
          },
          {
            title: "Unverified Financial Assumptions",
            detail: "Accepting AI-generated cost projections or variance figures without auditing back to original ledger files.",
          },
          {
            title: "Ignoring Data Retention Policies",
            detail: "Using personal consumer accounts where vendor terms state user prompts are retained for public model training.",
          },
        ],
        greenFlags: [
          {
            title: "Enterprise Tenant Protection",
            detail: "Using corporate-licensed Copilot or commercial APIs with contractual 'Zero Data Retention' guarantees.",
          },
          {
            title: "Proactive Data Anonymization",
            detail: "Systematically replacing vendor names, customer IDs, and project codes with neutral tokens ('Vendor A').",
          },
          {
            title: "Human-in-the-Loop Signoff",
            detail: "Checking verbatim citations and taking personal accountability before circulating any AI-assisted report.",
          },
        ],
      },
      narration:
        "On your board is the Red Flag versus Green Flag governance compliance scorecard. The red flags represent serious corporate compliance hazards: pasting unredacted NRICs, accepting unverified numbers, and using free consumer accounts. The green flags represent disciplined enterprise habits: working within protected tenants, anonymizing identifiers, and maintaining human accountability for every deliverable.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-5/data-handling.mp3`,
    },
    {
      id: "m5-enterprise-optout",
      startSec: 320,
      hudLabel: "5. Zero Retention Tenancy",
      camera: "board",
      board: {
        kind: "definition",
        heading: "Enterprise Data Isolation & Commercial Terms",
        row: rowOptOut,
      },
      narration:
        "Understanding enterprise data isolation is critical for every department manager. Free consumer tiers typically reserve the right to train future models on user queries. Enterprise tenants provide legal guarantees that your data stays inside your corporate perimeter, is never retained by the vendor, and is never used to train public models.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-5/enterprise-optout.mp3`,
    },
    {
      id: "m5-red-lines",
      startSec: 410,
      hudLabel: "6. Corporate Red Lines",
      camera: "instructor",
      board: {
        kind: "definitionsTable",
        heading: "3 Corporate AI Red Lines (Absolute Prohibitions)",
        rows: [
          {
            term: "Red Line 1: No Unredacted PII",
            meaning: "Never upload customer identity documents, medical records, or employee personal details.",
            workplaceExample: "Anonymize all customer claims before using AI to classify support ticket topics.",
          },
          {
            term: "Red Line 2: No Trade Secrets",
            meaning: "Never input proprietary chemical formulas, unpatented source code, or M&A negotiation terms.",
            workplaceExample: "Restricting strategic merger synergy models to isolated, offline internal tools.",
          },
          {
            term: "Red Line 3: No Blind Automation",
            meaning: "Never deploy autonomous decision-making that affects hiring, credit, or legal standing without human signoff.",
            workplaceExample: "Ensuring an HR manager reviews all AI-ranked resume shortlists before sending candidate rejections.",
          },
        ],
      },
      narration:
        "Memorize these three corporate red lines: Number 1, no unredacted personal data. Number 2, no trade secrets or merger plans in external tools. And Number 3, no blind automation where AI makes consequential life-impacting decisions without human review.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-5/red-lines.mp3`,
    },
    {
      id: "m5-takeaways",
      startSec: 510,
      hudLabel: "7. Key Takeaways",
      camera: "wide",
      board: {
        kind: "takeaway",
        heading: "Module 5 Key Takeaways",
        text: "1. Human accountability is non-negotiable: you are responsible for the final output.\n2. Comply with Malaysia's AIGE 2024 and PDPA 2024 amendments.\n3. Anonymize all personal data and customer identifiers before prompting.\n4. Ensure commercial zero-data-retention agreements are in place.\n5. Uphold corporate red lines against blind automation in critical decisions.",
      },
      narration:
        "To conclude Module 5: Responsible AI is not an obstacle to innovation; it is the prerequisite for sustainable corporate adoption. By respecting privacy, protecting commercial assets, and keeping human judgment at the center, you protect both your company and your career. Proceed to the knowledge check and confidence self-report.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-5/takeaways.mp3`,
    },
    {
      id: "m5-assessment",
      startSec: 575,
      hudLabel: "8. Knowledge Check (Quiz & Report)",
      camera: "instructor",
      board: {
        kind: "takeaway",
        heading: "Module 5 Knowledge Check & Self-Report",
        text: "Complete the 5-question knowledge check and 4-item confidence self-report to complete Module 5.",
      },
      narration:
        "Now, let us complete the five-question knowledge check and confidence self-report for Module 5.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-5/assessment.mp3`,
    },
  ],
};
