import type { DefinitionRow, LessonRecap, PlatformRow } from "../types/lesson";

const rowPresentationFirst: DefinitionRow = {
  term: "The 'Presentation First, Then Report' Pipeline",
  meaning:
    "An executive efficiency workflow where the core message, structure, and visuals are distilled into a presentation deck first, before expanding into a detailed written report.",
  workplaceExample:
    "Distilling a 40-page project proposal into an 8-slide executive pitch deck, gaining leadership buy-in, and then using that deck outline to generate the full governance report.",
};

const toolStack: PlatformRow[] = [
  {
    name: "Copilot / Claude",
    strength: "Structures & thinks: Cognitive structuring & argument synthesis",
    bestFor: "Formulating narrative arcs, slide-by-slide outlines, and speaker talking points",
  },
  {
    name: "Canva / PowerPoint AI",
    strength: "Designs the presentation: Layout formatting & brand templates",
    bestFor: "Automating layout typography, slide transitions, and enterprise brand visual standards",
  },
  {
    name: "Napkin.AI",
    strength: "Explains visually: Instant diagram & process flowchart generation",
    bestFor: "Converting bullet points and workflows into professional process flowcharts and infographics",
  },
];

export const moduleFourRecap: LessonRecap = {
  id: "module-4-recap",
  moduleId: "module-4",
  title: "Module 4 · Dynamic Presentation and Report with AI",
  durationSec: 600,
  prototypeNote: "Full production recap (~10 minutes) · Mastering executive decks, visual storytelling, and the presentation-first pipeline.",
  beats: [
    {
      id: "m4-intro",
      startSec: 0,
      hudLabel: "1. Overview",
      camera: "wide",
      board: {
        kind: "titles",
        programmeLine: "Level 1 · AI Foundations & Literacy",
        moduleTitle: "Module 4 · Dynamic Presentation and Report with AI",
        lessonTitle: "Accelerating Executive Storytelling Through the AI Media Pipeline",
      },
      narration:
        "Welcome to Module 4: Dynamic Presentation and Report with AI. In corporate life, professionals spend countless hours wrestling with slide alignment and writing wordy reports that nobody reads. In this 10-minute recap, you will discover the 'Presentation First, Then Report' workflow powered by a best-in-class three-tool AI stack.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-4/intro.mp3`,
    },
    {
      id: "m4-workflow",
      startSec: 60,
      hudLabel: "2. The AI Production Pipeline",
      camera: "board",
      board: {
        kind: "processFlow",
        heading: "The 'Presentation First, Then Report' Pipeline",
        steps: [
          {
            stepNumber: 1,
            title: "Copilot — Structures & Thinks",
            subtitle: "Brainstorm narrative arc, formulate 7-slide outline, draft talking points.",
            highlight: true,
          },
          {
            stepNumber: 2,
            title: "Canva — Designs Presentation",
            subtitle: "Apply brand templates, format layout typography, assemble presentation deck.",
            highlight: true,
          },
          {
            stepNumber: 3,
            title: "Napkin.AI — Explains Visually",
            subtitle: "Convert text bullets into instant process flowcharts, trees, and chevrons.",
            highlight: true,
          },
          {
            stepNumber: 4,
            title: "Reverse-Expand into Report",
            subtitle: "Feed approved slide arguments back into AI to write formal narrative document.",
          },
        ],
      },
      narration:
        "Traditional reporting starts with a 30-page document that is summarized into slides later. The modern AI approach flips this completely: first, Copilot structures the narrative and thinks through key arguments; second, Canva designs the presentation layout and brand formatting; third, Napkin.AI explains the process visually with instant diagrams; and finally, we reverse-expand the approved deck into a comprehensive written report.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-4/workflow.mp3`,
    },
    {
      id: "m4-tool-stack",
      startSec: 130,
      hudLabel: "3. The 3-Tool Stack",
      camera: "board",
      board: {
        kind: "platformMatrix",
        heading: "The 3-Tool Presentation Synergy",
        platforms: toolStack,
      },
      narration:
        "Look at the 3-tool matrix on the board. Do not expect one AI tool to do everything well. The proven training formula is: Copilot structures and thinks, Canva designs the presentation, and Napkin.AI explains the process visually.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-4/tool-stack.mp3`,
    },
    {
      id: "m4-prompt-deck",
      startSec: 200,
      hudLabel: "4. Slide Prompting",
      camera: "instructor",
      board: {
        kind: "promptComparison",
        heading: "Slide Outline Prompts: Novice vs. Executive",
        weakTitle: "Weak Prompt (Generic Bullet Points)",
        weakPrompt: "Make a 7 slide presentation about our new customer onboarding process.",
        strongTitle: "Executive Slide Architecture Prompt",
        strongPrompt:
          "Act as a Management Consultant. Create an outline for a 7-slide executive deck on 'Modernizing Customer Onboarding':\nFor each slide specify:\n1. Action-oriented Slide Headline (not just a topic)\n2. Core business takeaway (max 25 words)\n3. Recommended diagram format (e.g. 3-step chevron or comparative matrix)\n4. Verbatim speaker notes explaining the ROI.",
      },
      narration:
        "Notice the power of the Executive Slide Architecture Prompt. Instead of bland topic bullets, it demands action-oriented headlines, strict word counts, suggested diagram formats, and speaker notes focused on return on investment. This gives you a complete, ready-to-build presentation blueprint in seconds.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-4/prompt-deck.mp3`,
    },
    {
      id: "m4-visual-storytelling",
      startSec: 280,
      hudLabel: "5. Visual Storytelling",
      camera: "board",
      board: {
        kind: "processFlow",
        heading: "The 7-Slide Executive Presentation Blueprint",
        steps: [
          {
            stepNumber: 1,
            title: "Title & Big Idea",
            subtitle: "Strategic hook, business sponsor, executive perspective.",
          },
          {
            stepNumber: 2,
            title: "The Problem & Whose It Is",
            subtitle: "Quantified friction, department handoffs, cost of delay.",
          },
          {
            stepNumber: 3,
            title: "What We Found",
            subtitle: "Audit observations, data benchmarks, current reality.",
          },
          {
            stepNumber: 4,
            title: "The Core Insight",
            subtitle: "Napkin diagram: visual breakdown of the operational breakthrough.",
            highlight: true,
          },
          {
            stepNumber: 5,
            title: "How It Works",
            subtitle: "AI-assisted workflow, team responsibilities, tool handoffs.",
          },
          {
            stepNumber: 6,
            title: "Impact & Benefits",
            subtitle: "Hours recovered, error reduction, operational ROI.",
            highlight: true,
          },
          {
            stepNumber: 7,
            title: "Recommendation & Ask",
            subtitle: "Clear decision requested, pilot milestone, 30-day plan.",
          },
        ],
      },
      narration:
        "Bullet points create cognitive fatigue. Visual storytelling communicates complex relationships in seconds. On your screen is the 7-slide executive presentation blueprint. Notice Slide 4: instead of text walls, use Napkin.AI to render a conceptual diagram or workflow chevron. And on Slide 6, always deliver quantified hours and ROI.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-4/visual-storytelling.mp3`,
    },
    {
      id: "m4-report-generation",
      startSec: 360,
      hudLabel: "6. Expanding to Reports",
      camera: "instructor",
      board: {
        kind: "definition",
        heading: "Reverse Expansion into Formal Reports",
        row: rowPresentationFirst,
      },
      narration:
        "Once your presentation deck is approved by stakeholders, creating the comprehensive report is fast and painless. You feed the final slide titles, key data points, and speaker notes back into Claude or Copilot with a prompt commanding it to write formal, paragraph-level executive commentary. The resulting report is tightly aligned with what leaders already approved.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-4/report-generation.mp3`,
    },
    {
      id: "m4-quality-control",
      startSec: 440,
      hudLabel: "7. Quality & Brand Consistency",
      camera: "board",
      board: {
        kind: "definitionsTable",
        heading: "AI Presentation Quality Safeguards",
        rows: [
          {
            term: "The 1-Idea-Per-Slide Rule",
            meaning: "Restricting each slide to a single takeaway so the audience absorbs the core insight instantly.",
            workplaceExample: "Splitting a crowded financial update into three focused slides: Revenue, Margin, and Headcount.",
          },
          {
            term: "Fact & Figure Verification",
            meaning: "Cross-checking every AI-generated statistic against internal data sheets before final export.",
            workplaceExample: "Ensuring customer churn percentage quoted on Slide 4 matches the certified Q3 analytics database.",
          },
          {
            term: "Brand Palette Adherence",
            meaning: "Applying locked corporate color palettes and font tokens in Canva or PowerPoint templates.",
            workplaceExample: "Enforcing corporate obsidian background and gold accent tokens across all generated visual assets.",
          },
        ],
      },
      narration:
        "Always enforce three quality safeguards: The 1-Idea-per-slide rule keeps your audience engaged. Fact verification prevents embarrassing statistical discrepancies. And locked corporate brand templates ensure the final deck looks handcrafted by an elite design team.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-4/quality-control.mp3`,
    },
    {
      id: "m4-takeaways",
      startSec: 520,
      hudLabel: "8. Key Takeaways",
      camera: "wide",
      board: {
        kind: "takeaway",
        heading: "Module 4 Key Takeaways",
        text: "1. Build the presentation first to establish executive clarity.\n2. Leverage the 3-tool synergy: Copilot for thinking, Napkin for visuals, Canva for layout.\n3. Replace bullet points with process diagrams and chevrons.\n4. Reverse-expand the approved deck outline to write comprehensive reports.\n5. Enforce corporate brand tokens and verify all numerical metrics.",
      },
      narration:
        "To summarize Module 4: You now possess a modern, highly efficient workflow for enterprise storytelling. By combining structured prompting, automated diagramming, and reverse-report expansion, your team can produce boardroom-ready presentations in a fraction of the time. Proceed to the knowledge check and confidence self-report.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-4/takeaways.mp3`,
    },
    {
      id: "m4-assessment",
      startSec: 575,
      hudLabel: "9. Knowledge Check (Quiz & Report)",
      camera: "instructor",
      board: {
        kind: "takeaway",
        heading: "Module 4 Knowledge Check & Self-Report",
        text: "Complete the 5-question knowledge check and 4-item confidence self-report to complete Module 4.",
      },
      narration:
        "Now, let us complete the five-question knowledge check and confidence self-report for Module 4.",
      audioSrc: `${import.meta.env.BASE_URL}assets/audio/awang/module-4/assessment.mp3`,
    },
  ],
};
