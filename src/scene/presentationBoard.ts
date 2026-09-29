import type { BoardContent } from "../types/lesson";

const WIDTH = 1280;
const HEIGHT = 720;

function fill(ctx: CanvasRenderingContext2D, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

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
): void {
  fill(ctx, "#141820");

  // Top accent line
  ctx.fillStyle = "#c4a574";
  ctx.fillRect(0, 0, WIDTH, 8);

  // Top category tracking label
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 16px Segoe UI, sans-serif";
  ctx.fillText("PRESENTATION BOARD", 48, 44);

  if (content.kind === "titles") {
    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 24px Segoe UI, sans-serif";
    ctx.fillText(content.programmeLine, 48, 160);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 48px Segoe UI, sans-serif";
    wrap(ctx, content.moduleTitle, 48, 235, 1180, 58);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 32px Segoe UI, sans-serif";
    wrap(ctx, content.lessonTitle, 48, 390, 1180, 44);
    return;
  }

  if (content.kind === "definition") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 82);

    // Card background
    ctx.fillStyle = "#1b212c";
    ctx.fillRect(48, 120, 1184, 530);
    ctx.strokeStyle = "#c4a574";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 120, 1184, 530);

    // Term
    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 42px Segoe UI, sans-serif";
    wrap(ctx, content.row.term, 76, 185, 1128, 50);

    // Meaning
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "26px Segoe UI, sans-serif";
    wrap(ctx, content.row.meaning, 76, 275, 1128, 40);

    // Divider
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.moveTo(76, 410);
    ctx.lineTo(1204, 410);
    ctx.stroke();

    // Workplace example
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 18px Segoe UI, sans-serif";
    ctx.fillText("WORKPLACE APPLICATION:", 76, 450);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "24px Segoe UI, sans-serif";
    wrap(ctx, content.row.workplaceExample, 76, 492, 1128, 36);
    return;
  }

  if (content.kind === "layers") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 82);

    const revealed = Math.min(
      content.layers.length,
      Math.max(1, Math.floor(localSec / 3.2) + 1),
    );

    content.layers.forEach((layer, index) => {
      const y = 135 + index * 122;
      const active = index < revealed;
      ctx.fillStyle = active ? "#242c3b" : "#161b24";
      ctx.fillRect(48 + index * 24, y, 1184 - index * 48, 108);
      ctx.strokeStyle = active ? "#c4a574" : "#334155";
      ctx.lineWidth = active ? 2.5 : 1.5;
      ctx.strokeRect(48 + index * 24, y, 1184 - index * 48, 108);

      ctx.fillStyle = active ? "#f8fafc" : "#64748b";
      ctx.font = "bold 28px Segoe UI, sans-serif";
      wrap(ctx, layer, 76 + index * 24, y + 62, 1100 - index * 48, 36);
    });
    return;
  }

  if (content.kind === "definitionsTable") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 82);

    const colX = [48, 280, 750];
    const headers = ["Term", "What It Means", "Workplace Example"];
    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 20px Segoe UI, sans-serif";
    headers.forEach((header, i) => ctx.fillText(header, colX[i], 126));

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, 140);
    ctx.lineTo(1232, 140);
    ctx.stroke();

    content.rows.forEach((row, index) => {
      const y = 168 + index * 122;
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 24px Segoe UI, sans-serif";
      wrap(ctx, row.term, colX[0], y, 215, 30);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "20px Segoe UI, sans-serif";
      wrap(ctx, row.meaning, colX[1], y, 440, 28);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "20px Segoe UI, sans-serif";
      wrap(ctx, row.workplaceExample, colX[2], y, 470, 28);
    });
    return;
  }

  if (content.kind === "tokenPrediction") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 82);

    // Sentence Card
    ctx.fillStyle = "#1e2430";
    ctx.fillRect(48, 125, 1184, 120);
    ctx.strokeStyle = "#c4a574";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 125, 1184, 120);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 18px Segoe UI, sans-serif";
    ctx.fillText("PROMPT INPUT CONTEXT:", 72, 160);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 36px Segoe UI, sans-serif";
    ctx.fillText(content.sentence, 72, 210);

    // Tokens Section
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 18px Segoe UI, sans-serif";
    ctx.fillText("STATISTICALLY PREDICTED NEXT TOKENS (PROBABILITIES):", 48, 285);

    const tokenWidth = 222;
    content.tokens.forEach((t, i) => {
      const x = 48 + i * (tokenWidth + 18);
      const y = 305;
      const isTop = i === 0;

      ctx.fillStyle = isTop ? "#222d3e" : "#1b222c";
      ctx.fillRect(x, y, tokenWidth, 140);
      ctx.strokeStyle = isTop ? "#c4a574" : "#334155";
      ctx.lineWidth = isTop ? 2.5 : 1.5;
      ctx.strokeRect(x, y, tokenWidth, 140);

      ctx.fillStyle = isTop ? "#c4a574" : "#f8fafc";
      ctx.font = "bold 32px Segoe UI, sans-serif";
      ctx.fillText(`"${t.word}"`, x + 20, y + 56);

      ctx.fillStyle = isTop ? "#e5c898" : "#38bdf8";
      ctx.font = "bold 22px Segoe UI, sans-serif";
      ctx.fillText(t.probability, x + 20, y + 104);
    });

    // Context Note
    ctx.fillStyle = "#1e2430";
    ctx.fillRect(48, 475, 1184, 185);
    ctx.strokeStyle = "rgba(196, 165, 116, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 475, 1184, 185);

    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 18px Segoe UI, sans-serif";
    ctx.fillText("CORE TEACHING PRINCIPLE:", 72, 512);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "22px Segoe UI, sans-serif";
    wrap(ctx, content.contextNote, 72, 552, 1136, 32);
    return;
  }

  if (content.kind === "platformMatrix") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 82);

    const colX = [48, 280, 740];
    const headers = ["Platform", "Core Strength", "Best Workplace Use Case"];
    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 20px Segoe UI, sans-serif";
    headers.forEach((h, i) => ctx.fillText(h, colX[i], 126));

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, 140);
    ctx.lineTo(1232, 140);
    ctx.stroke();

    const rowHeight = Math.min(106, Math.floor(510 / content.platforms.length));
    content.platforms.forEach((p, i) => {
      const y = 168 + i * rowHeight;
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 24px Segoe UI, sans-serif";
      ctx.fillText(p.name, colX[0], y + 10);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "20px Segoe UI, sans-serif";
      wrap(ctx, p.strength, colX[1], y + 10, 430, 28);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "20px Segoe UI, sans-serif";
      wrap(ctx, p.bestFor, colX[2], y + 10, 480, 28);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.beginPath();
      ctx.moveTo(48, y + rowHeight - 6);
      ctx.lineTo(1232, y + rowHeight - 6);
      ctx.stroke();
    });
    return;
  }

  if (content.kind === "promptComparison") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 82);

    const cardWidth = 576;
    const cardHeight = 550;
    const y = 118;

    // Weak Prompt Card
    ctx.fillStyle = "#1c1719";
    ctx.fillRect(48, y, cardWidth, cardHeight);
    ctx.strokeStyle = "rgba(248, 81, 73, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, y, cardWidth, cardHeight);

    ctx.fillStyle = "#f87171";
    ctx.font = "bold 24px Segoe UI, sans-serif";
    ctx.fillText(content.weakTitle, 74, y + 45);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "20px Segoe UI, sans-serif";
    wrap(ctx, content.weakPrompt, 74, y + 95, 524, 32);

    // Strong CRE Prompt Card
    ctx.fillStyle = "#17222c";
    ctx.fillRect(656, y, cardWidth, cardHeight);
    ctx.strokeStyle = "#c4a574";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(656, y, cardWidth, cardHeight);

    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 24px Segoe UI, sans-serif";
    ctx.fillText(content.strongTitle, 682, y + 45);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "20px Segoe UI, sans-serif";
    wrap(ctx, content.strongPrompt, 682, y + 95, 524, 32);
    return;
  }

  if (content.kind === "processFlow") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 82);

    const count = content.steps.length;
    if (count <= 4) {
      const cardWidth = Math.floor((1184 - (count - 1) * 24) / count);
      const h = 530;
      const y = 125;

      content.steps.forEach((s, i) => {
        const x = 48 + i * (cardWidth + 24);
        ctx.fillStyle = s.highlight ? "#242c3b" : "#191f29";
        ctx.fillRect(x, y, cardWidth, h);
        ctx.strokeStyle = s.highlight ? "#c4a574" : "#334155";
        ctx.lineWidth = s.highlight ? 2.5 : 1.5;
        ctx.strokeRect(x, y, cardWidth, h);

        // Step number badge
        ctx.fillStyle = s.highlight ? "#c4a574" : "#334155";
        ctx.beginPath();
        ctx.arc(x + 44, y + 48, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = s.highlight ? "#0f141c" : "#f8fafc";
        ctx.font = "bold 22px Segoe UI, sans-serif";
        ctx.fillText(String(s.stepNumber), x + 38, y + 56);

        // Step title
        ctx.fillStyle = s.highlight ? "#f8fafc" : "#e2e8f0";
        ctx.font = "bold 24px Segoe UI, sans-serif";
        wrap(ctx, s.title, x + 20, y + 115, cardWidth - 40, 32);

        // Divider
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.moveTo(x + 20, y + 175);
        ctx.lineTo(x + cardWidth - 20, y + 175);
        ctx.stroke();

        // Subtitle / description
        ctx.fillStyle = "#94a3b8";
        ctx.font = "19px Segoe UI, sans-serif";
        wrap(ctx, s.subtitle, x + 20, y + 215, cardWidth - 40, 28);
      });
    } else {
      const perRow = Math.ceil(count / 2);
      const cardWidth = Math.floor((1184 - (perRow - 1) * 16) / perRow);
      const cardHeight = 255;

      content.steps.forEach((s, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const x = 48 + col * (cardWidth + 16);
        const y = 120 + row * (cardHeight + 20);

        ctx.fillStyle = s.highlight ? "#242c3b" : "#191f29";
        ctx.fillRect(x, y, cardWidth, cardHeight);
        ctx.strokeStyle = s.highlight ? "#c4a574" : "#334155";
        ctx.lineWidth = s.highlight ? 2.5 : 1.5;
        ctx.strokeRect(x, y, cardWidth, cardHeight);

        // Step number badge
        ctx.fillStyle = s.highlight ? "#c4a574" : "#334155";
        ctx.beginPath();
        ctx.arc(x + 32, y + 36, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = s.highlight ? "#0f141c" : "#f8fafc";
        ctx.font = "bold 18px Segoe UI, sans-serif";
        ctx.fillText(String(s.stepNumber), x + (s.stepNumber >= 10 ? 22 : 27), y + 43);

        // Step title
        ctx.fillStyle = s.highlight ? "#f8fafc" : "#e2e8f0";
        ctx.font = "bold 20px Segoe UI, sans-serif";
        wrap(ctx, s.title, x + 60, y + 42, cardWidth - 70, 26);

        // Divider
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.moveTo(x + 16, y + 78);
        ctx.lineTo(x + cardWidth - 16, y + 78);
        ctx.stroke();

        // Subtitle
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "17px Segoe UI, sans-serif";
        wrap(ctx, s.subtitle, x + 16, y + 110, cardWidth - 32, 24);
      });
    }
    return;
  }

  if (content.kind === "timeline") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 82);

    const colWidth = 576;
    const count = content.milestones.length;
    const perCol = Math.ceil(count / 2);

    content.milestones.forEach((m, i) => {
      const col = i < perCol ? 0 : 1;
      const indexInCol = i < perCol ? i : i - perCol;
      const x = 48 + col * (colWidth + 32);
      const y = 120 + indexInCol * 132;

      ctx.fillStyle = "#1b212c";
      ctx.fillRect(x, y, colWidth, 118);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, colWidth, 118);

      // Year badge
      ctx.fillStyle = "#c4a574";
      ctx.fillRect(x + 16, y + 16, 108, 36);
      ctx.fillStyle = "#0f141c";
      ctx.font = "bold 18px Segoe UI, sans-serif";
      ctx.fillText(m.year, x + 24, y + 40);

      // Title
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 20px Segoe UI, sans-serif";
      wrap(ctx, m.title, x + 136, y + 40, colWidth - 148, 26);

      // Impact description
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "17px Segoe UI, sans-serif";
      wrap(ctx, m.impact, x + 16, y + 80, colWidth - 32, 24);
    });
    return;
  }

  if (content.kind === "temperatureSpectrum") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 82);

    const barX = 48;
    const barY = 125;
    const barWidth = 1184;
    const barHeight = 32;

    const grad = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    grad.addColorStop(0.0, "#38bdf8");
    grad.addColorStop(0.35, "#2dd4bf");
    grad.addColorStop(0.65, "#fbbf24");
    grad.addColorStop(1.0, "#f87171");

    ctx.fillStyle = grad;
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
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
      ctx.fillRect(tx - 1, barY + barHeight, 2, 8);
      ctx.font = "bold 16px Segoe UI, sans-serif";
      ctx.fillText(t.val, tx - 12, barY + barHeight + 26);
    });

    const zoneY = 200;
    const zoneWidth = Math.floor((barWidth - 32) / 3);
    const zoneHeight = 425;

    content.zones.forEach((z, i) => {
      const zx = barX + i * (zoneWidth + 16);
      ctx.fillStyle = "#1b212c";
      ctx.fillRect(zx, zoneY, zoneWidth, zoneHeight);
      ctx.strokeStyle = z.color || (i === 0 ? "#38bdf8" : i === 1 ? "#fbbf24" : "#f87171");
      ctx.lineWidth = 2.5;
      ctx.strokeRect(zx, zoneY, zoneWidth, zoneHeight);

      // Range
      ctx.fillStyle = z.color || (i === 0 ? "#38bdf8" : i === 1 ? "#fbbf24" : "#f87171");
      ctx.font = "bold 30px Segoe UI, sans-serif";
      ctx.fillText(z.range, zx + 24, zoneY + 48);

      // Label
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 24px Segoe UI, sans-serif";
      wrap(ctx, z.label, zx + 24, zoneY + 95, zoneWidth - 48, 30);

      // Divider
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(zx + 24, zoneY + 135);
      ctx.lineTo(zx + zoneWidth - 24, zoneY + 135);
      ctx.stroke();

      // Subhead
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 17px Segoe UI, sans-serif";
      ctx.fillText("ENTERPRISE USE CASES:", zx + 24, zoneY + 168);

      // Use cases body
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "19px Segoe UI, sans-serif";
      wrap(ctx, z.useCases, zx + 24, zoneY + 205, zoneWidth - 48, 28);
    });

    if (content.note) {
      ctx.fillStyle = "#c4a574";
      ctx.font = "bold 16px Segoe UI, sans-serif";
      ctx.fillText(content.note, barX, 655);
    }
    return;
  }

  if (content.kind === "scorecardTable") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 78);

    const tableX = 48;
    const tableY = 115;
    const tableWidth = 1184;
    const colCount = content.headers.length;
    const colWidth = Math.floor(tableWidth / colCount);

    // Table Header
    ctx.fillStyle = "#222938";
    ctx.fillRect(tableX, tableY, tableWidth, 50);
    ctx.strokeStyle = "#374151";
    ctx.strokeRect(tableX, tableY, tableWidth, 50);

    ctx.fillStyle = "#c4a574";
    ctx.font = "bold 18px Segoe UI, sans-serif";
    content.headers.forEach((h, i) => {
      ctx.fillText(h, tableX + i * colWidth + 18, tableY + 32);
    });

    const rowHeight = Math.min(130, Math.floor(490 / content.rows.length));
    content.rows.forEach((r, rowIndex) => {
      const ry = tableY + 50 + rowIndex * rowHeight;
      ctx.fillStyle = rowIndex % 2 === 0 ? "#171c26" : "#1a202c";
      ctx.fillRect(tableX, ry, tableWidth, rowHeight);

      // Color accent indicator bar
      if (r.highlight === "red") {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(tableX, ry, 6, rowHeight);
      } else if (r.highlight === "amber") {
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(tableX, ry, 6, rowHeight);
      } else if (r.highlight === "green") {
        ctx.fillStyle = "#10b981";
        ctx.fillRect(tableX, ry, 6, rowHeight);
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.moveTo(tableX, ry + rowHeight);
      ctx.lineTo(tableX + tableWidth, ry + rowHeight);
      ctx.stroke();

      r.cells.forEach((cellText, colIndex) => {
        const cx = tableX + colIndex * colWidth + 18;
        const isFirst = colIndex === 0;
        ctx.fillStyle = isFirst ? "#f8fafc" : "#cbd5e1";
        ctx.font = isFirst ? "bold 18px Segoe UI, sans-serif" : "17px Segoe UI, sans-serif";
        wrap(ctx, cellText, cx, ry + 28, colWidth - 32, isFirst ? 26 : 25);
      });
    });

    if (content.note) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 16px Segoe UI, sans-serif";
      ctx.fillText(content.note, tableX, 660);
    }
    return;
  }

  if (content.kind === "kpiVariance") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 78);

    const mCount = content.metrics.length;
    const mWidth = Math.floor((1184 - (mCount - 1) * 20) / mCount);
    const mY = 115;
    const mHeight = 195;

    content.metrics.forEach((m, i) => {
      const mx = 48 + i * (mWidth + 20);
      ctx.fillStyle = "#1b212c";
      ctx.fillRect(mx, mY, mWidth, mHeight);
      ctx.strokeStyle = m.deltaType === "warning" ? "rgba(245, 158, 11, 0.6)" : "#334155";
      ctx.lineWidth = 2;
      ctx.strokeRect(mx, mY, mWidth, mHeight);

      // Label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 16px Segoe UI, sans-serif";
      ctx.fillText(m.label.toUpperCase(), mx + 20, mY + 36);

      // Primary Metric Number (Prominent & Large)
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 46px Segoe UI, sans-serif";
      ctx.fillText(m.value, mx + 20, mY + 95);

      // Delta
      if (m.delta) {
        ctx.fillStyle =
          m.deltaType === "positive"
            ? "#10b981"
            : m.deltaType === "warning"
              ? "#f59e0b"
              : "#cbd5e1";
        ctx.font = "bold 20px Segoe UI, sans-serif";
        ctx.fillText(m.delta, mx + 20, mY + 136);
      }

      // Subtext
      if (m.subtext) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "15px Segoe UI, sans-serif";
        ctx.fillText(m.subtext, mx + 20, mY + 166);
      }
    });

    if (content.narrativeText) {
      const ny = 330;
      const nHeight = 325;
      ctx.fillStyle = "#171c26";
      ctx.fillRect(48, ny, 1184, nHeight);
      ctx.strokeStyle = "#c4a574";
      ctx.lineWidth = 2;
      ctx.strokeRect(48, ny, 1184, nHeight);

      if (content.narrativeTitle) {
        ctx.fillStyle = "#c4a574";
        ctx.font = "bold 24px Segoe UI, sans-serif";
        ctx.fillText(content.narrativeTitle, 74, ny + 46);
      }

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "21px Segoe UI, sans-serif";
      wrap(
        ctx,
        content.narrativeText,
        74,
        ny + (content.narrativeTitle ? 96 : 48),
        1132,
        32,
      );
    }
    return;
  }

  if (content.kind === "governanceCard") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 78);

    const cardWidth = 576;
    const cardHeight = 545;
    const y = 115;

    // Red Flags Card
    const redX = 48;
    ctx.fillStyle = "#1c1417";
    ctx.fillRect(redX, y, cardWidth, cardHeight);
    ctx.strokeStyle = "rgba(248, 81, 73, 0.6)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(redX, y, cardWidth, cardHeight);

    ctx.fillStyle = "#f87171";
    ctx.font = "bold 22px Segoe UI, sans-serif";
    ctx.fillText("RED FLAGS — Prohibited Corporate Risks", redX + 24, y + 42);

    content.redFlags.forEach((rf, i) => {
      const itemY = y + 84 + i * 144;
      ctx.fillStyle = "#fca5a5";
      ctx.font = "bold 19px Segoe UI, sans-serif";
      ctx.fillText(`${i + 1}. ${rf.title}`, redX + 24, itemY);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "17px Segoe UI, sans-serif";
      wrap(ctx, rf.detail, redX + 24, itemY + 28, cardWidth - 48, 24);
    });

    // Green Flags Card
    const greenX = 656;
    ctx.fillStyle = "#111d16";
    ctx.fillRect(greenX, y, cardWidth, cardHeight);
    ctx.strokeStyle = "rgba(46, 160, 67, 0.6)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(greenX, y, cardWidth, cardHeight);

    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 22px Segoe UI, sans-serif";
    ctx.fillText("GREEN FLAGS — Compliant Enterprise Practice", greenX + 24, y + 42);

    content.greenFlags.forEach((gf, i) => {
      const itemY = y + 84 + i * 144;
      ctx.fillStyle = "#86efac";
      ctx.font = "bold 19px Segoe UI, sans-serif";
      ctx.fillText(`${i + 1}. ${gf.title}`, greenX + 24, itemY);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "17px Segoe UI, sans-serif";
      wrap(ctx, gf.detail, greenX + 24, itemY + 28, cardWidth - 48, 24);
    });
    return;
  }

  if (content.kind === "checklistCard") {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 30px Segoe UI, sans-serif";
    ctx.fillText(content.heading, 48, 78);

    const cCount = content.categories.length;
    const cWidth = Math.floor((1184 - (cCount - 1) * 24) / cCount);
    const y = 115;
    const cardHeight = 520;

    content.categories.forEach((cat, i) => {
      const cx = 48 + i * (cWidth + 24);
      ctx.fillStyle = "#181e28";
      ctx.fillRect(cx, y, cWidth, cardHeight);
      ctx.strokeStyle = "#c4a574";
      ctx.lineWidth = 2;
      ctx.strokeRect(cx, y, cWidth, cardHeight);

      // Header Banner
      ctx.fillStyle = "#222938";
      ctx.fillRect(cx, y, cWidth, 56);
      ctx.fillStyle = "#c4a574";
      ctx.font = "bold 20px Segoe UI, sans-serif";
      ctx.fillText(cat.title, cx + 20, y + 36);

      let itemY = y + 90;
      cat.items.forEach((item) => {
        // Checkbox box
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.strokeRect(cx + 20, itemY - 16, 20, 20);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 14px Segoe UI, sans-serif";
        ctx.fillText("✓", cx + 24, itemY - 1);

        // Text
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "18px Segoe UI, sans-serif";
        itemY = wrap(ctx, item, cx + 50, itemY, cWidth - 70, 26) + 18;
      });
    });

    if (content.footerNote) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 16px Segoe UI, sans-serif";
      ctx.fillText(content.footerNote, 48, 660);
    }
    return;
  }

  // Default takeaway
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 32px Segoe UI, sans-serif";
  ctx.fillText(content.heading, 48, 100);

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "32px Segoe UI, sans-serif";
  wrap(ctx, content.text, 48, 180, 1180, 46);
}
