import type { LessonRecap } from "../types/lesson";

export const moduleSixRecap: LessonRecap = {
  id: "module-6-recap",
  moduleId: "module-6",
  title: "Module 6 · Putting AI into Practice",
  durationSec: 600,
  prototypeNote:
    "Full production recap (~10 minutes) · Workplace friction audit, citation verification, ROI quantification, and 30-day adoption roadmap.",
  beats: [
    {
      id: "m6-intro",
      startSec: 0,
      hudLabel: "1. Overview",
      camera: "wide",
      board: {
        kind: "titles",
        programmeLine: "Level 1 · AI Foundations & Literacy",
        moduleTitle: "Module 6 · Putting AI into Practice",
        lessonTitle: "From Concepts to Desk-Level Workplace Transformation",
      },
      narration:
        "Welcome to Module 6: Putting AI into Practice. In the original in-person training, this module culminated in a group challenge. In this self-paced catch-up recap, we translate those capstone principles directly to where they matter most: your own desk. Across Modules 1 through 5, you mastered prompt briefing, document comparison, custom agents, dynamic presentations, and ethical guardrails. Now, we walk through the proven 8-step journey to turn these skills into measurable workplace productivity.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-6/intro.mp3`,
    },
    {
      id: "m6-pipeline",
      startSec: 45,
      hudLabel: "2. The Application Pipeline",
      camera: "board",
      board: {
        kind: "processFlow",
        heading: "The 8-Stage Workplace Application Journey (Solo Practice)",
        steps: [
          {
            stepNumber: 1,
            title: "Real Workplace Task",
            subtitle: "Select an actual recurring task from your weekly workload.",
          },
          {
            stepNumber: 2,
            title: "Identify Friction",
            subtitle: "Pinpoint where handoffs stall, take excessive time, or cause errors.",
          },
          {
            stepNumber: 3,
            title: "Choose AI Approach",
            subtitle: "Match the friction to the right tool: prompt, comparison, agent, or deck.",
          },
          {
            stepNumber: 4,
            title: "Apply Skill (M1–M5)",
            subtitle: "Execute using structured CRE, master prompt, or grounded assistant.",
            highlight: true,
          },
          {
            stepNumber: 5,
            title: "Validate Output",
            subtitle: "Check facts, eliminate hallucinations, audit verbatim source citations.",
            highlight: true,
          },
          {
            stepNumber: 6,
            title: "Human Review",
            subtitle: "Apply professional judgment, domain expertise, and accountability.",
          },
          {
            stepNumber: 7,
            title: "Improve & Propose",
            subtitle: "Refine prompt parameters; pitch the streamlined workflow to manager.",
          },
          {
            stepNumber: 8,
            title: "Build 30-Day Habit",
            subtitle: "Lock in daily sustained adoption with your personal 30-day action plan.",
            highlight: true,
          },
        ],
      },
      narration:
        "Here is your 8-stage roadmap for turning AI literacy into daily practice. We start with a genuine recurring task on your desk, diagnose the specific operational bottleneck, select the right AI capability from Modules 1 to 5, execute with structured prompts, validate citations against hallucinations, apply human review, improve the process, and anchor it into your routine through the 30-day commitment framework.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-6/pipeline.mp3`,
    },
    {
      id: "m6-identify-friction",
      startSec: 125,
      hudLabel: "3. Auditing Desk Friction",
      camera: "instructor",
      board: {
        kind: "definitionsTable",
        heading: "Auditing Your Workflow: 3 High-Value Workplace Targets",
        rows: [
          {
            term: "Cross-Department Handoffs",
            meaning:
              "Where workflows slow down between teams (e.g. Procurement ↔ Engineering, Finance ↔ Operations).",
            workplaceExample:
              "Chasing missing technical specifications or waiting days for vendor compliance sign-offs.",
          },
          {
            term: "Document-Heavy Reading",
            meaning:
              "Recurring tasks requiring manual line-by-line verification of multiple drafts or policies.",
            workplaceExample:
              "Auditing revised service agreements, supplier contracts, or quarterly departmental budgets.",
          },
          {
            term: "Repetitive Inquiries",
            meaning:
              "High-frequency operational questions that pull specialists away from strategic priorities.",
            workplaceExample:
              "Answering identical internal queries about SOP steps, per diem limits, or onboarding checklists.",
          },
        ],
      },
      narration:
        "Do not invent hypothetical use cases. Look at your calendar and inbox from the past month. High-value AI adoption targets three specific areas: friction at cross-department handoffs where information stalls between teams, document-heavy reading that burns hours of manual review, and repetitive inquiries that interrupt your deep work. Pick one real task to start.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-6/identify-friction.mp3`,
    },
    {
      id: "m6-tool-matching",
      startSec: 205,
      hudLabel: "4. Matching the AI Approach",
      camera: "board",
      board: {
        kind: "platformMatrix",
        heading: "Matching Workplace Problems to Modules 1–5 Capabilities",
        platforms: [
          {
            name: "Complex Instructions / Drafting (M1)",
            strength: "CRE Framework & Low Temp (0.0–0.5)",
            bestFor: "Drafting stakeholder updates, formal memos, SOP procedure rewrites",
          },
          {
            name: "Multi-Document Review (M2)",
            strength: "Master Comparison Prompt & Matrix",
            bestFor: "Reconciling version drifts, vendor proposal bids, budget variance audits",
          },
          {
            name: "High-Volume Team FAQs (M3)",
            strength: "Grounded Custom Agent (ANS/BAIT/REFUSE)",
            bestFor: "Internal team policy assistants, procurement buddies, spec checkers",
          },
          {
            name: "Executive Buy-in & Reports (M4)",
            strength: "3-Tool Stack (Copilot + Napkin + Canva)",
            bestFor: "7-slide managerial decision pitches, reverse-expanded audit reports",
          },
          {
            name: "Confidentiality & Compliance (M5)",
            strength: "Enterprise Zero-Retention & Redaction",
            bestFor: "Sanitizing PII before prompting; ensuring compliance with PDPA 2024",
          },
        ],
      },
      narration:
        "Once you have chosen your workplace task, match it to the right toolset from the course. If you are comparing contract versions or budgets, use the Module 2 Master Comparison Prompt. If you spend hours answering team policy questions, build a grounded Module 3 agent. If you need leadership support for a process change, use the Module 4 presentation blueprint. And always enforce Module 5 privacy protections before entering any data.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-6/tool-matching.mp3`,
    },
    {
      id: "m6-validation-audit",
      startSec: 285,
      hudLabel: "5. Validation & Stress Testing",
      camera: "board",
      board: {
        kind: "scorecardTable",
        heading: "Self-Administered Solo Verification Matrix",
        headers: ["Validation Phase", "Learner Action Required", "Pass Criteria", "Risk Mitigated"],
        rows: [
          {
            cells: [
              "1. Hallucination Check",
              "Cross-examine every AI-generated figure and clause against original PDFs.",
              "Every claim backed by exact verbatim citation and page number.",
              "False data in management briefings.",
            ],
            highlight: "green",
          },
          {
            cells: [
              "2. Self-Administered ANS",
              "Ask 3 standard policy questions the workflow or agent must handle.",
              "100% accurate factual responses citing corporate guidelines.",
              "Inaccurate employee guidance.",
            ],
            highlight: "green",
          },
          {
            cells: [
              "3. Self-Administered BAIT/REFUSE",
              "Test trick queries asking for confidential salaries or out-of-scope tasks.",
              "Polite refusal triggered with designated human contact email.",
              "Data leakage and prompt injection.",
            ],
            highlight: "amber",
          },
          {
            cells: [
              "4. PDPA & PII Audit",
              "Inspect inputs to confirm NRICs, bank details, and names are redacted.",
              "Zero personal data transmitted to AI prompt engine.",
              "Statutory regulatory breach under PDPA 2024.",
            ],
            highlight: "red",
          },
        ],
        note: "Core Workplace Principle: Never present an AI solution to colleagues or management until you have stress-tested it yourself.",
      },
      narration:
        "In the classroom, external judges tested student solutions. In the workplace, you are your own auditor. Before sharing an AI-generated output or custom agent with your team, run the self-administered verification matrix on the board: verify citations, confirm in-domain accuracy, test boundary refusals, and ensure zero PII is exposed. This guarantees audit readiness and protects your professional credibility.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-6/validation-audit.mp3`,
    },
    {
      id: "m6-roi-formulation",
      startSec: 360,
      hudLabel: "6. Quantifying Business ROI",
      camera: "board",
      board: {
        kind: "kpiVariance",
        heading: "Operational ROI Formulation: Quantifying Recovered Capacity",
        metrics: [
          {
            label: "Weekly Time Saved",
            value: "4.5 Hrs",
            delta: "Per Employee",
            deltaType: "positive",
            subtext: "Manual document review eliminated",
          },
          {
            label: "Team Impact",
            value: "30 Staff",
            delta: "Operations Dept",
            deltaType: "neutral",
            subtext: "Cross-functional rollout",
          },
          {
            label: "Annual Hours Recovered",
            value: "7,020 Hrs",
            delta: "+3.5 FTE Capacity",
            deltaType: "positive",
            subtext: "Redirected to strategic initiatives",
          },
          {
            label: "Financial Equivalent",
            value: "RM 280k+",
            delta: "Annual Value",
            deltaType: "positive",
            subtext: "Based on fully loaded labor rate",
          },
        ],
        narrativeTitle: "The Enterprise ROI Calculation Formula",
        narrativeText:
          "Formula: [Weekly Hours Saved per Person] × [Team Size] × [52 Weeks] = Annual Recovered Capacity.\nTranslating AI from a personal convenience into an executive proposal requires speaking the language of leadership. When you can demonstrate that streamlining contract comparisons or building an internal PO assistant recovers thousands of hours and eliminates costly delays, management approval becomes straightforward.",
      },
      narration:
        "Executives fund measurable business impact, not technology novelties. Use the ROI formula on your screen: multiply weekly hours saved by your team size across the year to show recovered strategic capacity. For example, saving four and a half hours a week across thirty team members returns over seven thousand hours annually—worth more than RM 280,000 in redirected capacity.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-6/roi-formulation.mp3`,
    },
    {
      id: "m6-propose-pitch",
      startSec: 435,
      hudLabel: "7. Proposing to Leadership",
      camera: "board",
      board: {
        kind: "processFlow",
        heading: "Manager Decision Briefing: 7-Slide Workplace Pitch",
        steps: [
          {
            stepNumber: 1,
            title: "Strategic Vision",
            subtitle: "Frame the business opportunity and alignment with department goals.",
          },
          {
            stepNumber: 2,
            title: "Desk-Level Friction",
            subtitle: "Quantify current bottleneck, delay days, and colleague frustration.",
          },
          {
            stepNumber: 3,
            title: "Audit Evidence",
            subtitle: "Present concrete benchmark data from your trial comparison or logs.",
          },
          {
            stepNumber: 4,
            title: "Workflow Breakthrough",
            subtitle: "Show the Napkin.AI diagram contrasting 'Before' vs 'After' steps.",
            highlight: true,
          },
          {
            stepNumber: 5,
            title: "Tested Solution",
            subtitle: "Demo the grounded prompt or agent link with safety guardrails active.",
          },
          {
            stepNumber: 6,
            title: "Quantified ROI",
            subtitle: "Present weekly hours saved, error reduction, and financial payback.",
            highlight: true,
          },
          {
            stepNumber: 7,
            title: "Pilot Request & Ask",
            subtitle: "Request permission for a 30-day departmental pilot with milestones.",
          },
        ],
      },
      narration:
        "When presenting your AI improvement to your department head or steering committee, use the 7-slide consulting structure. Start with the operational friction, share the audit data, display your Napkin diagram showing before and after workflows, prove the prototype is safe, show the quantified ROI, and conclude with a specific ask: a 30-day departmental pilot.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-6/propose-pitch.mp3`,
    },
    {
      id: "m6-30day-commitment",
      startSec: 510,
      hudLabel: "8. 30-Day AI Habit & Commitment",
      camera: "board",
      board: {
        kind: "checklistCard",
        heading: "The 30-Day Sustained AI Workplace Adoption Roadmap",
        categories: [
          {
            title: "Personal Workplace Commitment",
            items: [
              "One Real Task: Selected single recurring workflow on my desk",
              "One Reusable Prompt: Master template saved in personal library",
              "One Pilot Agent: Grounded assistant built with verified SOPs",
              "One Launch Date: Committed departmental milestone locked in calendar",
            ],
          },
          {
            title: "6 Sustained Practice Rules",
            items: [
              "Rule 1: Start with 1 real task — never practice on artificial work",
              "Rule 2: Refine prompts, don't restart — adjust context and constraints",
              "Rule 3: Build 1 small agent — solve a single operational question well",
              "Rule 4: Reuse templates — standardize prompts across your department",
              "Rule 5: Keep human in the loop — maintain final sign-off responsibility",
              "Rule 6: Share what works — brief colleagues on verified time-savers",
            ],
          },
        ],
        footerNote:
          "Key Principle: 'AI mastery is not an event; it is a daily workplace habit developed over the 30 days following training.'",
      },
      narration:
        "Training only creates value if it changes your everyday behavior. Here are the Six Sustained Practice Rules for your 30-day adoption roadmap: start with one real task, refine prompts rather than restarting, build one small agent, reuse templates, keep human judgment at the center, and share proven wins with your colleagues. Make a personal commitment to apply these tools starting this week.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-6/30day-commitment.mp3`,
    },
    {
      id: "m6-completion",
      startSec: 540,
      hudLabel: "9. Level 1 Completion & Takeaways",
      camera: "wide",
      board: {
        kind: "takeaway",
        heading: "Level 1: AI Foundations & Literacy Completed!",
        text: "Congratulations on completing Level 1!\n\n• Module 1: AI Basics & Prompting (Token prediction, CRE framework, temperature)\n• Module 2: Smart Comparison (7-step workflow, master prompts, variance & exceptions)\n• Module 3: Build AI Agents (Persona, grounding files, ANS·BAIT·REFUSE testing)\n• Module 4: Dynamic Presentation & Report (3-tool stack, 7-slide deck, reverse expansion)\n• Module 5: AI Ethics, Privacy & Security (AIGE 2024, PDPA 2024, red lines, zero retention)\n• Module 6: Putting AI into Practice (Desk friction audit, ROI calculation, 30-day habit)\n\nYou are equipped to lead practical AI adoption on your desk and in your organization.",
      },
      narration:
        "Congratulations! You have completed all six modules of Level 1: AI Foundations & Literacy. You now possess a comprehensive, enterprise-ready toolkit: knowing how models predict, how to write structured CRE briefs, how to compare multi-version documents, how to build and stress-test custom agents, how to create visual presentations, how to protect corporate data under PDPA 2024, and how to drive continuous productivity on your desk. Put these skills into practice today. Proceed to the knowledge check and confidence self-report to complete the program.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-6/completion.mp3`,
    },
    {
      id: "m6-assessment",
      startSec: 580,
      hudLabel: "10. Knowledge Check (Quiz & Report)",
      camera: "instructor",
      board: {
        kind: "takeaway",
        heading: "Module 6 Knowledge Check & Self-Report",
        text: "Complete the 5-question knowledge check and 4-item confidence self-report to complete Module 6.",
      },
      narration:
        "Now, let us complete the final five-question knowledge check and confidence self-report for Level 1.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-6/assessment.mp3`,
    },
  ],
};
