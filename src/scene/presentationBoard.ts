import type { BoardContent } from "../types/lesson";

export type BoardTransform = {
  zoom?: number;
  panX?: number;
  panY?: number;
};

const VIRTUAL_WIDTH = 1920;
const VIRTUAL_HEIGHT = 1080;

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

export function drawBoard(
  ctx: CanvasRenderingContext2D,
  content: BoardContent,
  localSec: number,
  transform?: BoardTransform,
): void {
  const texWidth = ctx.canvas.width;
  const texHeight = ctx.canvas.height;
  const baseScale = texWidth / VIRTUAL_WIDTH;

  const zoom = Math.max(0.5, Math.min(3.0, transform?.zoom ?? 1.0));
  const panX = transform?.panX ?? 0;
  const panY = transform?.panY ?? 0;

  ctx.save();

  // 1. Fill base texture canvas background with dark slate obsidian
  ctx.fillStyle = "#111620";
  ctx.fillRect(0, 0, texWidth, texHeight);

  // 2. Base resolution scale mapping 1920x1080 virtual canvas to native texture
  ctx.scale(baseScale, baseScale);

  // 3. Apply Zoom & Pan relative to virtual center
  if (zoom !== 1 || panX !== 0 || panY !== 0) {
    const cx = VIRTUAL_WIDTH / 2;
    const cy = VIRTUAL_HEIGHT / 2;
    ctx.translate(cx + panX, cy + panY);
    ctx.scale(zoom, zoom);
    ctx.translate(-cx, -cy);
  }

  // Top accent line (Executive Gold)
  ctx.fillStyle = "#c4a574";
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, 10);

  // Top category tracking label
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 20px 'Segoe UI', system-ui, sans-serif";
  ctx.fillText("PRESENTATION BOARD", 64, 52);

  if (content.kind === "titles") {
    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 32px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.programmeLine, 64, 220);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 60px 'Segoe UI', system-ui, sans-serif";
    wrap(ctx, content.moduleTitle, 64, 320, 1792, 74);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 40px 'Segoe UI', system-ui, sans-serif";
    wrap(ctx, content.lessonTitle, 64, 530, 1792, 54);

    ctx.restore();
    return;
  }

  if (content.kind === "definition") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 105);

    // Card background
    ctx.fillStyle = "#18202c";
    ctx.fillRect(64, 150, 1792, 860);
    ctx.strokeStyle = "#c4a574";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(64, 150, 1792, 860);

    // Term
    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 54px 'Segoe UI', system-ui, sans-serif";
    wrap(ctx, content.row.term, 108, 245, 1700, 64);

    // Meaning
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "32px 'Segoe UI', system-ui, sans-serif";
    wrap(ctx, content.row.meaning, 108, 360, 1700, 48);

    // Divider
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(108, 550);
    ctx.lineTo(1812, 550);
    ctx.stroke();

    // Workplace example
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 24px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("WORKPLACE APPLICATION:", 108, 620);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "30px 'Segoe UI', system-ui, sans-serif";
    wrap(ctx, content.row.workplaceExample, 108, 680, 1700, 46);

    ctx.restore();
    return;
  }

  if (content.kind === "layers") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 105);

    const revealed = Math.min(
      content.layers.length,
      Math.max(1, Math.floor(localSec / 3.2) + 1),
    );

    content.layers.forEach((layer, index) => {
      const y = 160 + index * 170;
      const active = index < revealed;
      ctx.fillStyle = active ? "#222c3c" : "#151b24";
      ctx.fillRect(64 + index * 36, y, 1792 - index * 72, 140);
      ctx.strokeStyle = active ? "#c4a574" : "#334155";
      ctx.lineWidth = active ? 3.0 : 1.5;
      ctx.strokeRect(64 + index * 36, y, 1792 - index * 72, 140);

      ctx.fillStyle = active ? "#f8fafc" : "#64748b";
      ctx.font = "bold 34px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, layer, 108 + index * 36, y + 80, 1700 - index * 72, 44);
    });

    ctx.restore();
    return;
  }

  if (content.kind === "definitionsTable") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 105);

    const colX = [64, 440, 1140];
    const headers = ["Term", "What It Means", "Workplace Example"];
    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 26px 'Segoe UI', system-ui, sans-serif";
    headers.forEach((header, i) => ctx.fillText(header, colX[i], 165));

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(64, 185);
    ctx.lineTo(1856, 185);
    ctx.stroke();

    content.rows.forEach((row, index) => {
      const y = 225 + index * 170;
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 30px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, row.term, colX[0], y, 340, 40);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "26px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, row.meaning, colX[1], y, 660, 38);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "26px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, row.workplaceExample, colX[2], y, 700, 38);

      if (index < content.rows.length - 1) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(64, y + 135);
        ctx.lineTo(1856, y + 135);
        ctx.stroke();
      }
    });

    ctx.restore();
    return;
  }

  if (content.kind === "tokenPrediction") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 105);

    // Sentence Card
    ctx.fillStyle = "#1d2532";
    ctx.fillRect(64, 155, 1792, 175);
    ctx.strokeStyle = "#c4a574";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(64, 155, 1792, 175);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 22px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("PROMPT INPUT CONTEXT:", 100, 205);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 44px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.sentence, 100, 275);

    // Tokens Section
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 22px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("STATISTICALLY PREDICTED NEXT TOKENS (PROBABILITIES):", 64, 380);

    const tokenWidth = 338;
    content.tokens.forEach((t, i) => {
      const x = 64 + i * (tokenWidth + 25);
      const y = 410;
      const isTop = i === 0;

      ctx.fillStyle = isTop ? "#222f42" : "#1a222e";
      ctx.fillRect(x, y, tokenWidth, 195);
      ctx.strokeStyle = isTop ? "#c4a574" : "#334155";
      ctx.lineWidth = isTop ? 3.0 : 1.5;
      ctx.strokeRect(x, y, tokenWidth, 195);

      ctx.fillStyle = isTop ? "#c4a574" : "#f8fafc";
      ctx.font = "bold 42px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(`"${t.word}"`, x + 28, y + 80);

      ctx.fillStyle = isTop ? "#fcd34d" : "#38bdf8";
      ctx.font = "bold 28px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(t.probability, x + 28, y + 148);
    });

    // Context Note
    ctx.fillStyle = "#1d2532";
    ctx.fillRect(64, 650, 1792, 275);
    ctx.strokeStyle = "rgba(196, 165, 116, 0.4)";
    ctx.lineWidth = 2.0;
    ctx.strokeRect(64, 650, 1792, 275);

    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 24px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("CORE TEACHING PRINCIPLE:", 100, 705);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "28px 'Segoe UI', system-ui, sans-serif";
    wrap(ctx, content.contextNote, 100, 765, 1720, 42);

    ctx.restore();
    return;
  }

  if (content.kind === "platformMatrix") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 105);

    const colX = [64, 440, 1140];
    const headers = ["Platform", "Core Strength", "Best Workplace Use Case"];
    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 26px 'Segoe UI', system-ui, sans-serif";
    headers.forEach((h, i) => ctx.fillText(h, colX[i], 165));

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(64, 185);
    ctx.lineTo(1856, 185);
    ctx.stroke();

    const rowHeight = Math.min(150, Math.floor(750 / content.platforms.length));
    content.platforms.forEach((p, i) => {
      const y = 225 + i * rowHeight;
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 32px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(p.name, colX[0], y + 16);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "26px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, p.strength, colX[1], y + 16, 660, 38);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "26px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, p.bestFor, colX[2], y + 16, 700, 38);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.moveTo(64, y + rowHeight - 10);
      ctx.lineTo(1856, y + rowHeight - 10);
      ctx.stroke();
    });

    ctx.restore();
    return;
  }

  if (content.kind === "promptComparison") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 105);

    const cardWidth = 880;
    const cardHeight = 840;
    const y = 155;

    // Weak Prompt Card
    ctx.fillStyle = "#1c1518";
    ctx.fillRect(64, y, cardWidth, cardHeight);
    ctx.strokeStyle = "rgba(248, 81, 73, 0.6)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(64, y, cardWidth, cardHeight);

    ctx.fillStyle = "#f87171";
    ctx.font = "bold 32px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.weakTitle, 100, y + 60);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "26px 'Segoe UI', system-ui, sans-serif";
    wrap(ctx, content.weakPrompt, 100, y + 130, 808, 42);

    // Strong CRE Prompt Card
    ctx.fillStyle = "#17232e";
    ctx.fillRect(976, y, cardWidth, cardHeight);
    ctx.strokeStyle = "#c4a574";
    ctx.lineWidth = 3.0;
    ctx.strokeRect(976, y, cardWidth, cardHeight);

    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 32px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.strongTitle, 1012, y + 60);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "26px 'Segoe UI', system-ui, sans-serif";
    wrap(ctx, content.strongPrompt, 1012, y + 130, 808, 42);

    ctx.restore();
    return;
  }

  if (content.kind === "processFlow") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 105);

    const count = content.steps.length;
    if (count <= 4) {
      const cardWidth = Math.floor((1792 - (count - 1) * 32) / count);
      const h = 840;
      const y = 155;

      content.steps.forEach((s, i) => {
        const x = 64 + i * (cardWidth + 32);
        ctx.fillStyle = s.highlight ? "#242e3f" : "#19202a";
        ctx.fillRect(x, y, cardWidth, h);
        ctx.strokeStyle = s.highlight ? "#c4a574" : "#334155";
        ctx.lineWidth = s.highlight ? 3.0 : 1.5;
        ctx.strokeRect(x, y, cardWidth, h);

        // Step number badge
        ctx.fillStyle = s.highlight ? "#c4a574" : "#334155";
        ctx.beginPath();
        ctx.arc(x + 58, y + 64, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = s.highlight ? "#0f141c" : "#f8fafc";
        ctx.font = "bold 28px 'Segoe UI', system-ui, sans-serif";
        ctx.fillText(String(s.stepNumber), x + (s.stepNumber >= 10 ? 44 : 50), y + 74);

        // Step title
        ctx.fillStyle = s.highlight ? "#f8fafc" : "#e2e8f0";
        ctx.font = "bold 32px 'Segoe UI', system-ui, sans-serif";
        wrap(ctx, s.title, x + 28, y + 155, cardWidth - 56, 42);

        // Divider
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.moveTo(x + 28, y + 235);
        ctx.lineTo(x + cardWidth - 28, y + 235);
        ctx.stroke();

        // Subtitle / description
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "26px 'Segoe UI', system-ui, sans-serif";
        wrap(ctx, s.subtitle, x + 28, y + 290, cardWidth - 56, 38);
      });
    } else {
      const perRow = Math.ceil(count / 2);
      const cardWidth = Math.floor((1792 - (perRow - 1) * 24) / perRow);
      const cardHeight = 405;

      content.steps.forEach((s, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const x = 64 + col * (cardWidth + 24);
        const y = 155 + row * (cardHeight + 28);

        ctx.fillStyle = s.highlight ? "#242e3f" : "#19202a";
        ctx.fillRect(x, y, cardWidth, cardHeight);
        ctx.strokeStyle = s.highlight ? "#c4a574" : "#334155";
        ctx.lineWidth = s.highlight ? 3.0 : 1.5;
        ctx.strokeRect(x, y, cardWidth, cardHeight);

        // Step number badge
        ctx.fillStyle = s.highlight ? "#c4a574" : "#334155";
        ctx.beginPath();
        ctx.arc(x + 48, y + 50, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = s.highlight ? "#0f141c" : "#f8fafc";
        ctx.font = "bold 24px 'Segoe UI', system-ui, sans-serif";
        ctx.fillText(String(s.stepNumber), x + (s.stepNumber >= 10 ? 37 : 42), y + 59);

        // Step title
        ctx.fillStyle = s.highlight ? "#f8fafc" : "#e2e8f0";
        ctx.font = "bold 28px 'Segoe UI', system-ui, sans-serif";
        wrap(ctx, s.title, x + 90, y + 58, cardWidth - 105, 34);

        // Divider
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.moveTo(x + 24, y + 105);
        ctx.lineTo(x + cardWidth - 24, y + 105);
        ctx.stroke();

        // Subtitle
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "24px 'Segoe UI', system-ui, sans-serif";
        wrap(ctx, s.subtitle, x + 24, y + 150, cardWidth - 48, 34);
      });
    }

    ctx.restore();
    return;
  }

  if (content.kind === "timeline") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 105);

    const colWidth = 875;
    const count = content.milestones.length;
    const perCol = Math.ceil(count / 2);

    content.milestones.forEach((m, i) => {
      const col = i < perCol ? 0 : 1;
      const indexInCol = i < perCol ? i : i - perCol;
      const x = 64 + col * (colWidth + 42);
      const y = 155 + indexInCol * 195;

      ctx.fillStyle = "#1b222d";
      ctx.fillRect(x, y, colWidth, 175);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.0;
      ctx.strokeRect(x, y, colWidth, 175);

      // Year badge
      ctx.fillStyle = "#c4a574";
      ctx.fillRect(x + 24, y + 24, 140, 48);
      ctx.fillStyle = "#0f141c";
      ctx.font = "bold 24px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(m.year, x + 36, y + 57);

      // Title
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 28px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, m.title, x + 185, y + 56, colWidth - 205, 36);

      // Impact description
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "24px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, m.impact, x + 24, y + 115, colWidth - 48, 34);
    });

    ctx.restore();
    return;
  }

  if (content.kind === "temperatureSpectrum") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 105);

    const barX = 64;
    const barY = 165;
    const barWidth = 1792;
    const barHeight = 44;

    const grad = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    grad.addColorStop(0.0, "#38bdf8");
    grad.addColorStop(0.35, "#2dd4bf");
    grad.addColorStop(0.65, "#fbbf24");
    grad.addColorStop(1.0, "#f87171");

    ctx.fillStyle = grad;
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2.0;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    const ticks = [
      { val: "0.0", pos: 0 },
      { val: "0.5", pos: 0.25 },
      { val: "1.0", pos: 0.5 },
      { val: "1.5", pos: 0.75 },
      { val: "2.0", pos: 1.0 },
    ];
    ticks.forEach((t) => {
      const tx = barX + t.pos * barWidth;
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(tx - 1, barY + barHeight, 2, 12);
      ctx.font = "bold 22px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(t.val, tx - 16, barY + barHeight + 36);
    });

    const zoneY = 275;
    const zoneWidth = Math.floor((barWidth - 48) / 3);
    const zoneHeight = 670;

    content.zones.forEach((z, i) => {
      const zx = barX + i * (zoneWidth + 24);
      ctx.fillStyle = "#1b212c";
      ctx.fillRect(zx, zoneY, zoneWidth, zoneHeight);
      ctx.strokeStyle = z.color || (i === 0 ? "#38bdf8" : i === 1 ? "#fbbf24" : "#f87171");
      ctx.lineWidth = 3.0;
      ctx.strokeRect(zx, zoneY, zoneWidth, zoneHeight);

      // Range
      ctx.fillStyle = z.color || (i === 0 ? "#38bdf8" : i === 1 ? "#fbbf24" : "#f87171");
      ctx.font = "bold 40px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(z.range, zx + 32, zoneY + 65);

      // Label
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 32px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, z.label, zx + 32, zoneY + 130, zoneWidth - 64, 40);

      // Divider
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.beginPath();
      ctx.moveTo(zx + 32, zoneY + 195);
      ctx.lineTo(zx + zoneWidth - 32, zoneY + 195);
      ctx.stroke();

      // Subhead
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 22px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText("ENTERPRISE USE CASES:", zx + 32, zoneY + 245);

      // Use cases body
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "26px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, z.useCases, zx + 32, zoneY + 300, zoneWidth - 64, 38);
    });

    if (content.note) {
      ctx.fillStyle = "#c4a574";
      ctx.font = "bold 22px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(content.note, barX, 1005);
    }

    ctx.restore();
    return;
  }

  if (content.kind === "scorecardTable") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 100);

    const tableX = 64;
    const tableY = 155;
    const tableWidth = 1792;
    const colCount = content.headers.length;
    const colWidth = Math.floor(tableWidth / colCount);

    // Table Header
    ctx.fillStyle = "#222938";
    ctx.fillRect(tableX, tableY, tableWidth, 68);
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2.0;
    ctx.strokeRect(tableX, tableY, tableWidth, 68);

    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 24px 'Segoe UI', system-ui, sans-serif";
    content.headers.forEach((h, i) => {
      ctx.fillText(h, tableX + i * colWidth + 24, tableY + 44);
    });

    const rowHeight = Math.min(180, Math.floor(750 / content.rows.length));
    content.rows.forEach((r, rowIndex) => {
      const ry = tableY + 68 + rowIndex * rowHeight;
      ctx.fillStyle = rowIndex % 2 === 0 ? "#171c26" : "#1a202c";
      ctx.fillRect(tableX, ry, tableWidth, rowHeight);

      // Color accent indicator bar
      if (r.highlight === "red") {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(tableX, ry, 8, rowHeight);
      } else if (r.highlight === "amber") {
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(tableX, ry, 8, rowHeight);
      } else if (r.highlight === "green") {
        ctx.fillStyle = "#10b981";
        ctx.fillRect(tableX, ry, 8, rowHeight);
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.moveTo(tableX, ry + rowHeight);
      ctx.lineTo(tableX + tableWidth, ry + rowHeight);
      ctx.stroke();

      r.cells.forEach((cellText, colIndex) => {
        const cx = tableX + colIndex * colWidth + 24;
        const isFirst = colIndex === 0;
        ctx.fillStyle = isFirst ? "#f8fafc" : "#cbd5e1";
        ctx.font = isFirst
          ? "bold 24px 'Segoe UI', system-ui, sans-serif"
          : "22px 'Segoe UI', system-ui, sans-serif";
        wrap(ctx, cellText, cx, ry + 40, colWidth - 44, isFirst ? 34 : 32);
      });
    });

    if (content.note) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 22px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(content.note, tableX, 1010);
    }

    ctx.restore();
    return;
  }

  if (content.kind === "kpiVariance") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 100);

    const mCount = content.metrics.length;
    const mWidth = Math.floor((1792 - (mCount - 1) * 28) / mCount);
    const mY = 155;
    const mHeight = 280;

    content.metrics.forEach((m, i) => {
      const mx = 64 + i * (mWidth + 28);
      ctx.fillStyle = "#1b212c";
      ctx.fillRect(mx, mY, mWidth, mHeight);
      ctx.strokeStyle = m.deltaType === "warning" ? "rgba(245, 158, 11, 0.7)" : "#334155";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(mx, mY, mWidth, mHeight);

      // Label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 22px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(m.label.toUpperCase(), mx + 28, mY + 50);

      // Primary Metric Number (Prominent & Large)
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 68px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(m.value, mx + 28, mY + 135);

      // Delta
      if (m.delta) {
        ctx.fillStyle =
          m.deltaType === "positive"
            ? "#10b981"
            : m.deltaType === "warning"
              ? "#f59e0b"
              : "#cbd5e1";
        ctx.font = "bold 28px 'Segoe UI', system-ui, sans-serif";
        ctx.fillText(m.delta, mx + 28, mY + 195);
      }

      // Subtext
      if (m.subtext) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "22px 'Segoe UI', system-ui, sans-serif";
        ctx.fillText(m.subtext, mx + 28, mY + 240);
      }
    });

    if (content.narrativeText) {
      const ny = 475;
      const nHeight = 490;
      ctx.fillStyle = "#171c26";
      ctx.fillRect(64, ny, 1792, nHeight);
      ctx.strokeStyle = "#c4a574";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(64, ny, 1792, nHeight);

      if (content.narrativeTitle) {
        ctx.fillStyle = "#c4a574";
        ctx.font = "bold 32px 'Segoe UI', system-ui, sans-serif";
        ctx.fillText(content.narrativeTitle, 100, ny + 68);
      }

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "28px 'Segoe UI', system-ui, sans-serif";
      wrap(
        ctx,
        content.narrativeText,
        100,
        ny + (content.narrativeTitle ? 140 : 70),
        1720,
        44,
      );
    }

    ctx.restore();
    return;
  }

  if (content.kind === "governanceCard") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 100);

    const cardWidth = 880;
    const cardHeight = 840;
    const y = 155;

    // Red Flags Card
    const redX = 64;
    ctx.fillStyle = "#1c1417";
    ctx.fillRect(redX, y, cardWidth, cardHeight);
    ctx.strokeStyle = "rgba(248, 81, 73, 0.7)";
    ctx.lineWidth = 3.0;
    ctx.strokeRect(redX, y, cardWidth, cardHeight);

    ctx.fillStyle = "#f87171";
    ctx.font = "bold 30px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("RED FLAGS — Prohibited Corporate Risks", redX + 32, y + 60);

    content.redFlags.forEach((rf, i) => {
      const itemY = y + 120 + i * 220;
      ctx.fillStyle = "#fca5a5";
      ctx.font = "bold 26px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(`${i + 1}. ${rf.title}`, redX + 32, itemY);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "24px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, rf.detail, redX + 32, itemY + 40, cardWidth - 64, 34);
    });

    // Green Flags Card
    const greenX = 976;
    ctx.fillStyle = "#111d16";
    ctx.fillRect(greenX, y, cardWidth, cardHeight);
    ctx.strokeStyle = "rgba(46, 160, 67, 0.7)";
    ctx.lineWidth = 3.0;
    ctx.strokeRect(greenX, y, cardWidth, cardHeight);

    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 30px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("GREEN FLAGS — Compliant Enterprise Practice", greenX + 32, y + 60);

    content.greenFlags.forEach((gf, i) => {
      const itemY = y + 120 + i * 220;
      ctx.fillStyle = "#86efac";
      ctx.font = "bold 26px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(`${i + 1}. ${gf.title}`, greenX + 32, itemY);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "24px 'Segoe UI', system-ui, sans-serif";
      wrap(ctx, gf.detail, greenX + 32, itemY + 40, cardWidth - 64, 34);
    });

    ctx.restore();
    return;
  }

  if (content.kind === "checklistCard") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(content.heading, 64, 100);

    const cCount = content.categories.length;
    const cWidth = Math.floor((1792 - (cCount - 1) * 32) / cCount);
    const y = 155;
    const cardHeight = 810;

    content.categories.forEach((cat, i) => {
      const cx = 64 + i * (cWidth + 32);
      ctx.fillStyle = "#181e28";
      ctx.fillRect(cx, y, cWidth, cardHeight);
      ctx.strokeStyle = "#c4a574";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx, y, cWidth, cardHeight);

      // Header Banner
      ctx.fillStyle = "#222938";
      ctx.fillRect(cx, y, cWidth, 76);
      ctx.fillStyle = "#c4a574";
      ctx.font = "bold 26px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(cat.title, cx + 28, y + 48);

      let itemY = y + 130;
      cat.items.forEach((item) => {
        // Checkbox box
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(cx + 28, itemY - 22, 26, 26);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 18px 'Segoe UI', system-ui, sans-serif";
        ctx.fillText("✓", cx + 33, itemY - 2);

        // Text
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "24px 'Segoe UI', system-ui, sans-serif";
        itemY = wrap(ctx, item, cx + 70, itemY, cWidth - 95, 36) + 26;
      });
    });

    if (content.footerNote) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 22px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(content.footerNote, 64, 1010);
    }

    ctx.restore();
    return;
  }

  // Default takeaway
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 44px 'Segoe UI', system-ui, sans-serif";
  ctx.fillText(content.heading, 64, 140);

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "40px 'Segoe UI', system-ui, sans-serif";
  wrap(ctx, content.text, 64, 250, 1792, 58);

  ctx.restore();
}
