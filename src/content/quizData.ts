export type QuizQuestion = {
  id: string;
  topicTag: string;
  question: string;
  options: {
    id: string;
    label: string;
  }[];
  correctId: string;
  explanation: string;
};

export type ModuleQuizData = {
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
  topicRecaps: Record<string, string[]>;
};

export const QUIZ_DATA_BY_MODULE: Record<string, ModuleQuizData> = {
  // =========================================================================
  // MODULE 1 — AI BASICS
  // =========================================================================
  "module-1": {
    moduleId: "module-1",
    title: "Module 1 · AI Foundations & Literacy",
    questions: [
      {
        id: "m1-q1",
        topicTag: "AI Core Definitions",
        question:
          "Which statement accurately distinguishes Generative AI from traditional workplace automation?",
        options: [
          {
            id: "a",
            label:
              "Automation follows fixed, rule-based triggers, whereas Generative AI creates novel text, code, or media by internalizing data patterns.",
          },
          {
            id: "b",
            label:
              "Automation requires deep neural networks, while Generative AI only executes pre-programmed if-then scripts.",
          },
          {
            id: "c",
            label:
              "Generative AI can only process structured spreadsheets, while automation generates free-form executive reports.",
          },
          {
            id: "d",
            label:
              "There is no difference; both terms describe the identical software mechanism.",
          },
        ],
        correctId: "a",
        explanation:
          "Automation executes deterministic, rule-based tasks (like scheduled calendar events or email triggers), whereas Generative AI synthesizes net-new content from learned statistical patterns.",
      },
      {
        id: "m1-q2",
        topicTag: "Token Prediction Engine",
        question:
          "How do Large Language Models (LLMs) fundamentally generate answers to user prompts?",
        options: [
          {
            id: "a",
            label:
              "By querying a hidden human editorial board in real time across the cloud.",
          },
          {
            id: "b",
            label:
              "By predicting the most statistically probable next token (word or sub-word) based on learned patterns and prompt context.",
          },
          {
            id: "c",
            label:
              "By retrieving pre-written static paragraphs stored in a fixed corporate database.",
          },
          {
            id: "d",
            label:
              "By executing compiled binary code directly on local operating system drivers.",
          },
        ],
        correctId: "b",
        explanation:
          "LLMs do not 'know' facts in a human sense; they operate as pattern engines that iteratively predict the most probable next token given the prompt's context.",
      },
      {
        id: "m1-q3",
        topicTag: "Platform Selection",
        question:
          "When selecting an AI platform for drafting long-form policy manuals or complex technical documentation requiring deep analytical reasoning, which class of tool is best suited?",
        options: [
          {
            id: "a",
            label:
              "Lightweight consumer chat widgets with small context windows.",
          },
          {
            id: "b",
            label:
              "Advanced foundation frontier models (e.g. Claude 3.5 Sonnet, GPT-4o) with large context windows and strong reasoning benchmarks.",
          },
          {
            id: "c",
            label:
              "Basic image generation tools with prompt translation plugins.",
          },
          {
            id: "d",
            label:
              "Rule-based email auto-responders.",
          },
        ],
        correctId: "b",
        explanation:
          "Long-form synthesis, nuanced policy analysis, and multi-page technical consistency require frontier models with high reasoning capacity and extended context windows.",
      },
      {
        id: "m1-q4",
        topicTag: "CRE Framework",
        question:
          "In the CRE Prompting Framework, what essential element does the 'R' (Role) provide to the AI model?",
        options: [
          {
            id: "a",
            label:
              "It instructs the AI to restart its training weights from scratch.",
          },
          {
            id: "b",
            label:
              "It defines the specific professional perspective, tone, and domain expertise the AI must adopt.",
          },
          {
            id: "c",
            label:
              "It restricts the AI to only responding in rhyming sentences.",
          },
          {
            id: "d",
            label:
              "It triggers an automated web scrape across public social media.",
          },
        ],
        correctId: "b",
        explanation:
          "The Role specifies the vantage point—such as an experienced procurement coordinator or quality assurance engineer—anchoring tone, depth, and domain terminology.",
      },
      {
        id: "m1-q5",
        topicTag: "Temperature & Precision",
        question:
          "When generating financial summaries, compliance checklists, or operational audit procedures, what temperature calibration should be applied?",
        options: [
          {
            id: "a",
            label:
              "High temperature (1.5 to 2.0) to maximize poetic spontaneity and surprise.",
          },
          {
            id: "b",
            label:
              "Low temperature (0.0 to 0.4) to maximize deterministic consistency, factual precision, and minimize variance.",
          },
          {
            id: "c",
            label:
              "Negative temperature (-1.0) to invert prompt meanings.",
          },
          {
            id: "d",
            label:
              "Temperature is only relevant for adjusting computer monitor brightness.",
          },
        ],
        correctId: "b",
        explanation:
          "Low temperature (0.0–0.4) constrains token selection to high-probability choices, ensuring fact-grounded, reproducible enterprise outputs.",
      },
    ],
    topicRecaps: {
      "AI Core Definitions": [
        "Automation executes fixed if-then rules; Generative AI synthesizes novel content from learned patterns.",
        "Machine Learning learns from data; Deep Learning powers multi-layered neural networks.",
      ],
      "Token Prediction Engine": [
        "AI predicts the next likely token based on context; clear prompts narrow statistical probability toward accurate outputs.",
        "Context acts as a mathematical steering wheel for token probability.",
      ],
      "Platform Selection": [
        "Match the platform to the task: use large-context frontier models for deep document reasoning and specialized tools for lightweight drafting.",
        "Evaluate tool selection based on context window, data privacy tenancy, and domain capabilities.",
      ],
      "CRE Framework": [
        "Context: Brief the operational background, situation, and input data.",
        "Role: Establish the exact professional vantage point and seniority level.",
        "Expectation: Define explicit output format, constraints, tone, and word count ceiling.",
      ],
      "Temperature & Precision": [
        "Use 0.0–0.4 for compliance, audits, legal, and financial reporting where precision is paramount.",
        "Use 0.7–1.0 only for creative brainstorming and lateral concept exploration.",
      ],
    },
  },

  // =========================================================================
  // MODULE 2 — SMART COMPARISON
  // =========================================================================
  "module-2": {
    moduleId: "module-2",
    title: "Module 2 · Smart Comparison Made Easy with AI",
    questions: [
      {
        id: "m2-q1",
        topicTag: "Comparison Objectives",
        question:
          "What is the critical first step before feeding multi-page contracts or reports into an AI comparison engine?",
        options:
          [
            {
              id: "a",
              label:
                "Asking the AI to generate a creative marketing slogan for the documents.",
            },
            {
              id: "b",
              label:
                "Defining the exact comparison objective, scope, and specific risk categories to inspect.",
            },
            {
              id: "c",
              label:
                "Converting all text into uppercase letters to speed up processing.",
            },
            {
              id: "d",
              label:
                "Deleting all dates and numbers to avoid confusing the model.",
            },
          ],
        correctId: "b",
        explanation:
          "Step 1 of the 7-step workflow requires explicitly defining the objective (e.g. indemnity clauses, pricing deviations, SLA penalties) so the AI focuses its analysis.",
      },
      {
        id: "m2-q2",
        topicTag: "Multi-Document Grounding",
        question:
          "When comparing Version A and Version B of a technical agreement, how should source documents be supplied to ensure accurate cross-referencing?",
        options: [
          {
            id: "a",
            label:
              "Provide only vague verbal summaries without actual file text.",
          },
          {
            id: "b",
            label:
              "Upload or paste both authoritative texts clearly labeled with distinct identifiers (e.g. 'Document A - Original' vs. 'Document B - Revised').",
          },
          {
            id: "c",
            label:
              "Mix the paragraphs of both documents into a single randomized file.",
          },
          {
            id: "d",
            label:
              "Rely exclusively on the AI's pre-training memory from 2023.",
          },
        ],
        correctId: "b",
        explanation:
          "Authoritative multi-document analysis requires distinctly labeled source texts so the model can cite exact sections and track lineage.",
      },
      {
        id: "m2-q3",
        topicTag: "Variance Analysis",
        question:
          "In enterprise variance analysis, what is the primary role of AI when reviewing two quarterly balance sheets or budget tables?",
        options: [
          {
            id: "a",
            label:
              "Approving wire transfers automatically without human sign-off.",
          },
          {
            id: "b",
            label:
              "Rapidly extracting numerical deltas, percentage variances, and flagging deviations that exceed defined thresholds.",
          },
          {
            id: "c",
            label:
              "Randomly smoothing numbers to make charts look visually appealing.",
          },
          {
            id: "d",
            label:
              "Replacing the corporate ERP database permanently.",
          },
        ],
        correctId: "b",
        explanation:
          "AI excels at rapid extraction and flagging anomalies or variances exceeding business tolerance thresholds, preparing structured findings for human review.",
      },
      {
        id: "m2-q4",
        topicTag: "Exception Hunting",
        question:
          "What is 'Exception Hunting' in the context of corporate contract and policy comparison?",
        options: [
          {
            id: "a",
            label:
              "Looking for typographical spelling errors in employee signatures.",
          },
          {
            id: "b",
            label:
              "Systematically uncovering omitted clauses, hidden liability shifts, non-standard covenants, or unannounced term revisions.",
          },
          {
            id: "c",
            label:
              "Canceling software subscriptions without notifying procurement.",
          },
          {
            id: "d",
            label:
              "Searching for software coding syntax errors in Word documents.",
          },
        ],
        correctId: "b",
        explanation:
          "Exception hunting focuses on high-risk departures from standard templates—such as shifted indemnities, removed warranties, or altered termination periods.",
      },
      {
        id: "m2-q5",
        topicTag: "Verification & Audit Readiness",
        question:
          "According to the Smart Comparison workflow, what must happen before AI-generated comparison findings are acted upon or presented to executive leadership?",
        options: [
          {
            id: "a",
            label:
              "Immediate distribution to all stakeholders without spot-checking.",
          },
          {
            id: "b",
            label:
              "Human verification against the primary source citations to validate accuracy and eliminate hallucination risk.",
          },
          {
            id: "c",
            label:
              "Running the comparison prompt 50 times to compute an average score.",
          },
          {
            id: "d",
            label:
              "Deleting the original source files to save disk storage.",
          },
        ],
        correctId: "b",
        explanation:
          "Step 6 (Source Verification) mandates that a human specialist verifies AI-flagged differences against original clause citations prior to executive sign-off.",
      },
    ],
    topicRecaps: {
      "Comparison Objectives": [
        "Always define specific comparison criteria, scope, and key risk indicators before initiating AI review.",
        "Scope clarity prevents models from getting distracted by superficial formatting differences.",
      ],
      "Multi-Document Grounding": [
        "Label source documents distinctly with clear version tags to allow traceable side-by-side analysis.",
        "Always ground comparison prompts in complete source text rather than partial summaries.",
      ],
      "Variance Analysis": [
        "Use structured table prompts to calculate absolute deltas, percentage variance, and directional shifts.",
        "Establish quantitative thresholds to immediately highlight critical material discrepancies.",
      ],
      "Exception Hunting": [
        "Instruct the model to isolate missing protections, altered liabilities, and non-standard covenants.",
        "Search for what has been deleted or omitted, not just what was added.",
      ],
      "Verification & Audit Readiness": [
        "Human-in-the-loop verification is mandatory; audit readiness requires checking AI citations against primary sources.",
        "Document verified findings in an executive audit table with source paragraph references.",
      ],
    },
  },

  // =========================================================================
  // MODULE 3 — AI AGENTS
  // =========================================================================
  "module-3": {
    moduleId: "module-3",
    title: "Module 3 · Build AI Agents for Your Team",
    questions: [
      {
        id: "m3-q1",
        topicTag: "Agent Persona & Scope",
        question:
          "When designing an enterprise AI agent, why is it dangerous to define an open-ended scope such as 'do everything the team needs'?",
        options: [
          {
            id: "a",
            label:
              "Because AI models consume more battery power when given broad instructions.",
          },
          {
            id: "b",
            label:
              "Because unbounded scope leads to unpredictable hallucinations, unauthorized advice, and failure to enforce compliance guardrails.",
          },
          {
            id: "c",
            label:
              "Because the user interface will run out of screen pixels.",
          },
          {
            id: "d",
            label:
              "Because open-ended agents refuse to answer any questions.",
          },
        ],
        correctId: "b",
        explanation:
          "Agents must have tightly bounded scopes, specific functional boundaries, and clear definitions of what they are and are not permitted to answer.",
      },
      {
        id: "m3-q2",
        topicTag: "Knowledge Grounding",
        question:
          "How should an enterprise agent be configured to answer queries regarding internal company policies?",
        options: [
          {
            id: "a",
            label:
              "Allow it to browse general internet blogs and social forums for opinions.",
          },
          {
            id: "b",
            label:
              "Ground the agent strictly in verified, approved company documentation and instruct it to cite sources.",
          },
          {
            id: "c",
            label:
              "Let the model guess based on generic common sense.",
          },
          {
            id: "d",
            label:
              "Disable all document retrieval to reduce latency.",
          },
        ],
        correctId: "b",
        explanation:
          "Grounding agents on authoritative internal documents prevents speculation and ensures answers reflect current corporate guidelines.",
      },
      {
        id: "m3-q3",
        topicTag: "Guardrails & Boundaries",
        question:
          "What is the primary function of negative constraints (guardrails) in an agent's system prompt?",
        options: [
          {
            id: "a",
            label:
              "To make the agent's tone argumentative and combative.",
          },
          {
            id: "b",
            label:
              "To clearly define off-limit topics, enforce refusal behaviors, and prevent confidential data leakage or unauthorized commitments.",
          },
          {
            id: "c",
            label:
              "To prevent the user from typing more than five words.",
          },
          {
            id: "d",
            label:
              "To force the agent to turn off after 10 minutes.",
          },
        ],
        correctId: "b",
        explanation:
          "Guardrails define explicit corporate boundaries, such as never providing legal counsel, never promising commercial discounts, and protecting confidential information.",
      },
      {
        id: "m3-q4",
        topicTag: "ANS / BAIT / REFUSE Testing",
        question:
          "In the agent stress-testing framework, what is the specific objective of the 'BAIT' test?",
        options: [
          {
            id: "a",
            label:
              "To see if the agent can process questions in different languages.",
          },
          {
            id: "b",
            label:
              "To deliberately prompt the agent with malicious, deceptive, or out-of-scope inquiries to test whether its guardrails hold.",
          },
          {
            id: "c",
            label:
              "To test whether the agent can generate computer code faster.",
          },
          {
            id: "d",
            label:
              "To measure how many concurrent users can connect simultaneously.",
          },
        ],
        correctId: "b",
        explanation:
          "BAIT tests challenge the agent with edge cases, prompt injections, and off-limit topics to verify that refusal mechanisms trigger reliably.",
      },
      {
        id: "m3-q5",
        topicTag: "Escalation Protocols",
        question:
          "When an agent encounters ambiguous queries, conflicting source data, or situations beyond its defined authorization, what protocol must trigger?",
        options: [
          {
            id: "a",
            label:
              "Make an educated guess and present it with high confidence.",
          },
          {
            id: "b",
            label:
              "Decline politely and escalate the query to a designated human department or subject matter expert.",
          },
          {
            id: "c",
            label:
              "Crash the browser window to protect system memory.",
          },
          {
            id: "d",
            label:
              "Re-write the company policy document on the fly.",
          },
        ],
        correctId: "b",
        explanation:
          "Robust enterprise agents have predefined escalation paths, handing off ambiguous or critical queries to human experts.",
      },
    ],
    topicRecaps: {
      "Agent Persona & Scope": [
        "Narrow agent scope to a single operational domain with defined inputs, outputs, and capabilities.",
        "Specify the exact audience and operational purpose in the system instruction preamble.",
      ],
      "Knowledge Grounding": [
        "Anchor agents strictly to approved internal knowledge repositories; enforce citations.",
        "Instruct the agent: 'If the answer is not explicitly in the grounded files, state that the information is unavailable.'",
      ],
      "Guardrails & Boundaries": [
        "Explicitly specify what the agent must NEVER do, including legal advice, pricing commitments, or disclosure of raw system prompts.",
        "Boundary enforcement protects organization liability and intellectual property.",
      ],
      "ANS / BAIT / REFUSE Testing": [
        "Stress test agents before deployment: ANS verifies valid questions work, BAIT verifies edge-case resistance, and REFUSE verifies proper handoffs.",
        "Maintain a test suite of adversarial prompts to validate safety before publishing.",
      ],
      "Escalation Protocols": [
        "Equip every agent with clear human handoff triggers when confidence is low or policy exceptions occur.",
        "Provide explicit routing contact details for escalated inquiries.",
      ],
    },
  },

  // =========================================================================
  // MODULE 4 — PRESENTATION & REPORT
  // =========================================================================
  "module-4": {
    moduleId: "module-4",
    title: "Module 4 · Dynamic Presentation and Report with AI",
    questions: [
      {
        id: "m4-q1",
        topicTag: "Presentation Pipeline",
        question:
          "In the modern AI media pipeline taught in Module 4, why is drafting the presentation structure and slide outline recommended before expanding into a full report?",
        options: [
          {
            id: "a",
            label:
              "Because slides use fewer colors than text documents.",
          },
          {
            id: "b",
            label:
              "Because slide architecture forces structural clarity, executive hierarchy, and message discipline before generating dense narrative text.",
          },
          {
            id: "c",
            label:
              "Because AI cannot write written reports longer than one paragraph.",
          },
          {
            id: "d",
            label:
              "Because presentations do not require factual review.",
          },
        ],
        correctId: "b",
        explanation:
          "Slide outlining forces the creator to establish key executive messages and narrative flow first, preventing wordy, unfocused reports.",
      },
      {
        id: "m4-q2",
        topicTag: "The 3-Tool Stack",
        question:
          "Which tool in the approved 3-tool presentation stack is specifically designed to transform raw bullet points and concepts into visual diagrams and flowcharts?",
        options: [
          {
            id: "a",
            label:
              "Napkin.AI",
          },
          {
            id: "b",
            label:
              "VLC Media Player",
          },
          {
            id: "c",
            label:
              "Notepad.exe",
          },
          {
            id: "d",
            label:
              "Windows Command Prompt",
          },
        ],
        correctId: "a",
        explanation:
          "Napkin.AI converts narrative ideas and text sequences directly into visual business diagrams, process flows, and relationship graphics.",
      },
      {
        id: "m4-q3",
        topicTag: "Visual Storytelling",
        question:
          "What is the core principle of 'One Clear Message per Section' in executive presentations?",
        options: [
          {
            id: "a",
            label:
              "Every slide must contain at least 500 words to demonstrate thoroughness.",
          },
          {
            id: "b",
            label:
              "Each slide or report section should deliver a single, unmistakable takeaway supported by clean visual evidence.",
          },
          {
            id: "c",
            label:
              "Presentations should only use abstract animated 3D shapes.",
          },
          {
            id: "d",
            label:
              "All slides in a deck must share the exact same title.",
          },
        ],
        correctId: "b",
        explanation:
          "Cognitive load is reduced when each slide or section focuses on one primary insight, reinforced by diagrams rather than cluttered walls of text.",
      },
      {
        id: "m4-q4",
        topicTag: "Expanding to Reports",
        question:
          "Once the presentation storyboard is approved, how does generative AI accelerate creating the accompanying formal report?",
        options: [
          {
            id: "a",
            label:
              "It invents new financial figures to make the company look more profitable.",
          },
          {
            id: "b",
            label:
              "It expands validated slide headlines, data points, and visual narratives into cohesive, detailed report sections while preserving structure.",
          },
          {
            id: "c",
            label:
              "It converts the slide deck into an audio podcast only.",
          },
          {
            id: "d",
            label:
              "It replaces all words with computer code.",
          },
        ],
        correctId: "b",
        explanation:
          "AI uses the approved slide deck as an outline blueprint, systematically expanding each point into comprehensive written sections with contextual depth.",
      },
      {
        id: "m4-q5",
        topicTag: "Source & Brand Consistency",
        question:
          "When integrating AI-generated charts, statistics, and infographics into leadership presentations, what quality gate is essential?",
        options: [
          {
            id: "a",
            label:
              "Assuming all AI-generated charts are mathematically accurate without verification.",
          },
          {
            id: "b",
            label:
              "Verifying underlying metrics against primary financial systems and ensuring brand palette, typography, and logo compliance.",
          },
          {
            id: "c",
            label:
              "Removing all source attributions to make the deck look proprietary.",
          },
          {
            id: "d",
            label:
              "Exporting slides as low-resolution thumbnails.",
          },
        ],
        correctId: "b",
        explanation:
          "Presentations must adhere to corporate brand standards and undergo rigorous fact-checking against source accounting or operational data.",
      },
    ],
    topicRecaps: {
      "Presentation Pipeline": [
        "Start with executive storyboard decks to nail message structure before expanding into multi-page prose.",
        "The deck serves as a visual agreement with leadership on storyline, priorities, and action items.",
      ],
      "The 3-Tool Stack": [
        "Combine AI reasoning (Copilot/ChatGPT) for structure, visual engines (Napkin.AI) for diagrams, and design tools (Canva/PowerPoint) for polished layouts.",
        "Use each tool for its highest-leverage strength rather than forcing one tool to do everything.",
      ],
      "Visual Storytelling": [
        "Enforce one primary message per slide; use visual schemas over dense text blocks to maximize executive retention.",
        "Pair every major conclusion with visual proof or structured data comparison.",
      ],
      "Expanding to Reports": [
        "Use validated presentation slides as the structural scaffold for long-form narrative documentation.",
        "Instruct AI to preserve the exact narrative order and data conclusions when elaborating text.",
      ],
      "Source & Brand Consistency": [
        "Cross-examine every AI-generated statistic against operational records and enforce corporate branding guidelines.",
        "Lock brand typography, primary colors, and logo placement across all generated artifacts.",
      ],
    },
  },

  // =========================================================================
  // MODULE 5 — ETHICS, PRIVACY & SECURITY
  // =========================================================================
  "module-5": {
    moduleId: "module-5",
    title: "Module 5 · AI Ethics, Privacy and Security at Work",
    questions: [
      {
        id: "m5-q1",
        topicTag: "Data Privacy & Tenancy",
        question:
          "Why is entering proprietary trade secrets or customer personally identifiable information (PII) into free public consumer AI tools a violation of corporate policy?",
        options: [
          {
            id: "a",
            label:
              "Because public tools use user prompts and inputs to train future public models, causing data exposure.",
          },
          {
            id: "b",
            label:
              "Because public tools automatically delete files after 24 hours.",
          },
          {
            id: "c",
            label:
              "Because public consumer tools are slower during business hours.",
          },
          {
            id: "d",
            label:
              "Because public AI tools charge per letter typed.",
          },
        ],
        correctId: "a",
        explanation:
          "Free public tools frequently log prompts for foundation model training. Enterprise agreements with Zero Data Retention (ZDR) guarantee prompts are never used for model training.",
      },
      {
        id: "m5-q2",
        topicTag: "Malaysia AIGE & PDPA",
        question:
          "Under modern data protection regulations such as Malaysia's PDPA 2024 and national AI governance guidelines, what is required when handling personal customer data with AI?",
        options: [
          {
            id: "a",
            label:
              "No consent is required if AI does the processing.",
          },
          {
            id: "b",
            label:
              "Explicit data consent, purpose limitation, robust data minimization, and protection against unauthorized cross-border transfers.",
          },
          {
            id: "c",
            label:
              "Publishing customer records on public repositories for transparency.",
          },
          {
            id: "d",
            label:
              "Customer data must be stored only on smartphones.",
          },
        ],
        correctId: "b",
        explanation:
          "PDPA and AI governance guidelines mandate lawful consent, strict security safeguards, and purpose limitation when processing customer information.",
      },
      {
        id: "m5-q3",
        topicTag: "Corporate Red Lines",
        question:
          "Which of the following actions represents an absolute corporate RED LINE that must NEVER be performed with AI without formal legal clearance?",
        options: [
          {
            id: "a",
            label:
              "Using an approved enterprise tool to summarize an unreleased quarterly financial statement without authorization.",
          },
          {
            id: "b",
            label:
              "Drafting a meeting agenda for an internal team sync.",
          },
          {
            id: "c",
            label:
              "Summarizing a public industry whitepaper.",
          },
          {
            id: "d",
            label:
              "Formatting a list of project milestones in chronological order.",
          },
        ],
        correctId: "a",
        explanation:
          "Handling confidential earnings reports, unreleased M&A data, or regulated intellectual property without enterprise clearance violates securities and compliance red lines.",
      },
      {
        id: "m5-q4",
        topicTag: "Fairness & Bias",
        question:
          "When using AI systems for screening job applicants or evaluating vendor proposals, what ethical risk must be monitored?",
        options: [
          {
            id: "a",
            label:
              "The AI might finish the screening too quickly.",
          },
          {
            id: "b",
            label:
              "Algorithmic bias originating from historical training datasets, leading to unfair discrimination against specific groups.",
          },
          {
            id: "c",
            label:
              "The AI will automatically hire all applicants.",
          },
          {
            id: "d",
            label:
              "Applicant resumes might be too well-formatted.",
          },
        ],
        correctId: "b",
        explanation:
          "AI models inherit biases from historical training data; algorithmic fairness audits and human review are necessary to prevent discriminatory decisions.",
      },
      {
        id: "m5-q5",
        topicTag: "Human Accountability",
        question:
          "If an AI-generated report contains incorrect financial calculations or erroneous legal interpretations, who bears ultimate responsibility in a corporate environment?",
        options: [
          {
            id: "a",
            label:
              "The AI platform vendor.",
          },
          {
            id: "b",
            label:
              "The individual employee and the human supervisory team who published or acted on the output.",
          },
          {
            id: "c",
            label:
              "The computer's operating system.",
          },
          {
            id: "d",
            label:
              "Nobody, because AI is autonomous.",
          },
        ],
        correctId: "b",
        explanation:
          "AI is an assistive tool, not a legal entity. Ultimate accountability for corporate output always remains with the human employee and management.",
      },
    ],
    topicRecaps: {
      "Data Privacy & Tenancy": [
        "Only use enterprise-approved AI accounts with Zero Data Retention tenancy; never paste proprietary data into public consumer tools.",
        "Public tools may ingest prompts into training corpora, exposing company IP.",
      ],
      "Malaysia AIGE & PDPA": [
        "Adhere to PDPA 2024 compliance: enforce purpose limitation, data masking, and consent protocols for all personal records.",
        "Anonymize or pseudomymize personal identifiers prior to AI ingestion.",
      ],
      "Corporate Red Lines": [
        "Respect absolute red lines: unreleased financial data, M&A plans, customer PII, and trade secrets are strictly restricted.",
        "When in doubt, consult internal legal and compliance officers before uploading sensitive materials.",
      ],
      "Fairness & Bias": [
        "Actively inspect AI outputs for algorithmic bias when evaluating talent, procurement proposals, or credit evaluations.",
        "Ensure human panel review checks for discriminatory patterns in automated screenings.",
      ],
      "Human Accountability": [
        "Human oversight is non-negotiable; you remain legally and professionally accountable for any AI-assisted work you submit.",
        "Never cite 'the AI made a mistake' as a justification for unverified corporate deliverables.",
      ],
    },
  },

  // =========================================================================
  // MODULE 6 — PUTTING AI INTO PRACTICE
  // =========================================================================
  "module-6": {
    moduleId: "module-6",
    title: "Module 6 · Putting AI into Practice",
    questions: [
      {
        id: "m6-q1",
        topicTag: "Auditing Desk Friction",
        question:
          "When beginning to integrate AI into your daily corporate workflow, what is the best starting strategy for identifying high-impact use cases?",
        options: [
          {
            id: "a",
            label:
              "Trying to replace your entire job on day one.",
          },
          {
            id: "b",
            label:
              "Auditing daily desk friction: identifying recurring, repetitive tasks that consume significant manual hours and have structured inputs.",
          },
          {
            id: "c",
            label:
              "Waiting for management to provide an automated script for every task.",
          },
          {
            id: "d",
            label:
              "Applying AI only to personal social media activities.",
          },
        ],
        correctId: "b",
        explanation:
          "High-ROI adoption starts with friction audits: pinpointing repetitive, time-draining workflows like meeting summaries, contract comparisons, or data reconciliation.",
      },
      {
        id: "m6-q2",
        topicTag: "Workflow Matching",
        question:
          "Which workflow is best suited for prompt templates versus custom AI agents?",
        options: [
          {
            id: "a",
            label:
              "Prompt templates for standardized one-off drafting tasks; custom agents for multi-step workflows requiring grounded knowledge and strict guardrails.",
          },
          {
            id: "b",
            label:
              "Custom agents for writing single one-sentence emails; prompt templates for enterprise ERP integration.",
          },
          {
            id: "c",
            label:
              "There is no functional distinction between prompts and agents.",
          },
          {
            id: "d",
            label:
              "Neither should ever be reused.",
          },
        ],
        correctId: "a",
        explanation:
          "Templates handle recurring episodic drafting efficiently, while agents handle complex, multi-turn tasks with persistent context and guardrails.",
      },
      {
        id: "m6-q3",
        topicTag: "Quantifying Business ROI",
        question:
          "When proposing an AI workflow transformation to department leadership, what metric is most persuasive?",
        options: [
          {
            id: "a",
            label:
              "How many technical buzzwords were included in the prompt.",
          },
          {
            id: "b",
            label:
              "Measurable time saved, reduction in error rates, acceleration in cycle time, and direct business cost avoidance.",
          },
          {
            id: "c",
            label:
              "The number of tokens consumed per week.",
          },
          {
            id: "d",
            label:
              "How cool the AI interface looks.",
          },
        ],
        correctId: "b",
        explanation:
          "Leadership evaluates initiatives on tangible business value: hours saved, faster customer response times, and lower compliance error rates.",
      },
      {
        id: "m6-q4",
        topicTag: "Human-in-the-Loop Validation",
        question:
          "What role does the employee play in a mature human-in-the-loop AI workplace process?",
        options: [
          {
            id: "a",
            label:
              "A passive spectator who clicks 'Send' without reading outputs.",
          },
          {
            id: "b",
            label:
              "The expert editor, validator, and decision-maker who directs the AI, checks outputs, and owns the final deliverable.",
          },
          {
            id: "c",
            label:
              "An adversary who refuses to use technology.",
          },
          {
            id: "d",
            label:
              "A computer hardware technician.",
          },
        ],
        correctId: "b",
        explanation:
          "AI is a cognitive multiplier; human expertise provides strategic judgment, ethical boundary enforcement, and final validation.",
      },
      {
        id: "m6-q5",
        topicTag: "30-Day AI Habit Building",
        question:
          "According to the Level 1 Handbook commitment plan, what is the key to building lasting workplace AI competence over 30 days?",
        options: [
          {
            id: "a",
            label:
              "Daily deliberate practice: applying AI to 1–2 real workplace tasks each day and documenting reusable prompts in a personal playbook.",
          },
          {
            id: "b",
            label:
              "Taking a 6-month break before opening an AI tool again.",
          },
          {
            id: "c",
            label:
              "Only using AI when facing a major crisis.",
          },
          {
            id: "d",
            label:
              "Relying entirely on external consultants for every routine task.",
          },
        ],
        correctId: "a",
        explanation:
          "Sustained capability comes from consistent daily micro-application: building, refining, and documenting prompt playbooks for routine responsibilities.",
      },
    ],
    topicRecaps: {
      "Auditing Desk Friction": [
        "Inventory weekly tasks to spot repetitive friction: document synthesis, status tracking, and formatting consume 30%+ of desk time.",
        "Prioritize tasks that have high frequency and clear input-output patterns.",
      ],
      "Workflow Matching": [
        "Select the right tier: simple CRE prompts for quick queries, templates for recurring reports, and agents for multi-step bounded workflows.",
        "Do not over-engineer an agent when a structured prompt template solves the problem.",
      ],
      "Quantifying Business ROI": [
        "Track baseline hours vs. AI-assisted hours to demonstrate tangible time reclamation and operational turnaround.",
        "Frame efficiency gains in terms of capacity unlocked for higher-value strategic projects.",
      ],
      "Human-in-the-Loop Validation": [
        "Never outsource final accountability; review AI outputs for hallucination, completeness, and strategic nuance before release.",
        "Establish personal quality checklist criteria before sending AI-assisted work to stakeholders.",
      ],
      "30-Day AI Habit Building": [
        "Commit to daily application: maintain a curated prompt library and share validated workflows with your team.",
        "Document what worked, refine prompts through iteration, and build institutional knowledge.",
      ],
    },
  },
};

export function getModuleQuizData(moduleId?: string): ModuleQuizData {
  if (!moduleId) return QUIZ_DATA_BY_MODULE["module-1"];
  const lower = moduleId.trim().toLowerCase();
  if (lower.includes("6") || lower.includes("six") || lower.includes("practice")) {
    return QUIZ_DATA_BY_MODULE["module-6"];
  }
  if (lower.includes("5") || lower.includes("five") || lower.includes("ethics") || lower.includes("security")) {
    return QUIZ_DATA_BY_MODULE["module-5"];
  }
  if (lower.includes("4") || lower.includes("four") || lower.includes("presentation") || lower.includes("report")) {
    return QUIZ_DATA_BY_MODULE["module-4"];
  }
  if (lower.includes("3") || lower.includes("three") || lower.includes("agent")) {
    return QUIZ_DATA_BY_MODULE["module-3"];
  }
  if (lower.includes("2") || lower.includes("two") || lower.includes("comparison")) {
    return QUIZ_DATA_BY_MODULE["module-2"];
  }
  return QUIZ_DATA_BY_MODULE["module-1"];
}
