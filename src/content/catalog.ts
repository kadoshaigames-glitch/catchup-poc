import type { CourseLesson, CourseModule } from "../types/lesson";

export const ACCESS_CODE = "1234KadoshAI";

/**
 * Official Curriculum Hierarchy:
 * Lesson 1 — Level 1: AI Foundations & Literacy
 *   Module 1 — AI Basics and Prompting (POC Ready: ~78s Demo)
 *   Module 2 — Smart Comparison (Content mapping in progress)
 *   Module 3 — Build AI Agents (Content mapping in progress)
 *   Module 4 — Dynamic Presentation and Report (Content mapping in progress)
 *   Module 5 — Ethics, Privacy and Security (Ready: ~10 min Recap)
 *   Module 6 — Putting AI into Practice (Ready: ~10 min Recap)
 *
 * Each module is an independent learning experience with its own ~10-minute recap in production.
 */
export const lessonOne: CourseLesson = {
  id: "lesson-1",
  code: "TTDA-L1",
  title: "Lesson 1",
  subtitle: "Level 1: AI Foundations & Literacy",
  description:
    "Empowering Innovation: Bridging AI Concepts to Corporate Readiness. Across six independent modules, you learn how AI works, how to instruct it, analyze data, build agents, and apply ethical guardrails.",
  modules: [
    {
      id: "module-1",
      moduleNumber: 1,
      title: "Module 1",
      subtitle: "AI Basics and Prompting",
      description:
        "Understand AI fundamentals, token probability prediction ('The cat sat on the...'), tool selection (ChatGPT, Claude, Gemini, Grok, Copilot), the CRE framework, and 10-step prompt engineering.",
      available: true,
      recapId: "m1-recap",
      statusLabel: "Ready (~10 min + 78s Demo)",
      recapMinutes: 10,
    },
    {
      id: "module-2",
      moduleNumber: 2,
      title: "Module 2",
      subtitle: "Smart Comparison Made Easy with AI",
      description:
        "Master the 7-step AI comparison workflow, master prompts for multi-document review, variance analysis, exception identification, and source validation.",
      available: true,
      recapId: "m2-recap",
      statusLabel: "Ready (~10 min Recap)",
      recapMinutes: 10,
    },
    {
      id: "module-3",
      moduleNumber: 3,
      title: "Module 3",
      subtitle: "Build AI Agents for Your Team",
      description:
        "Design focused corporate chatbots with custom personas, uploaded knowledge files, explicit escalation paths, and stress testing (ANS, BAIT, REFUSE).",
      available: true,
      recapId: "m3-recap",
      statusLabel: "Ready (~10 min Recap)",
      recapMinutes: 10,
    },
    {
      id: "module-4",
      moduleNumber: 4,
      title: "Module 4",
      subtitle: "Dynamic Presentation and Report with AI",
      description:
        "Master the 'presentation first, then report' pipeline using the three-tool stack: Copilot (thinking/structure), Canva (design/layout), and Napkin.AI (visuals).",
      available: true,
      recapId: "m4-recap",
      statusLabel: "Ready (~10 min Recap)",
      recapMinutes: 10,
    },
    {
      id: "module-5",
      moduleNumber: 5,
      title: "Module 5",
      subtitle: "AI Ethics, Privacy and Security at Work",
      description:
        "Ground AI use in corporate governance, Malaysia's AIGE 2024 guidelines, PDPA 2024 amendments, five ethical pillars, bias prevention, and commercial data protection.",
      available: true,
      recapId: "m5-recap",
      statusLabel: "Ready (~10 min Recap)",
      recapMinutes: 10,
    },
    {
      id: "module-6",
      moduleNumber: 6,
      title: "Module 6",
      subtitle: "Putting AI into Practice",
      description:
        "Apply Modules 1–5 to a real workplace task on your desk: audit workflow friction, choose the right AI approach, validate citations against hallucinations, calculate ROI, and build a sustained 30-day habit.",
      available: true,
      recapId: "m6-recap",
      statusLabel: "Ready (~10 min Recap)",
      recapMinutes: 10,
    },
  ],
};

export const catalog: CourseModule[] = lessonOne.modules;

export function getModule(moduleId: string): CourseModule | undefined {
  return lessonOne.modules.find((m) => m.id === moduleId);
}
