import { useEffect, useMemo, useState } from "react";

type Props = {
  narration: string;
  beatStartSec: number;
  beatDurationSec: number;
  currentTimeSec: number;
  isPlaying: boolean;
  audioSrc?: string;
};

export interface TimedWord {
  id: string;
  word: string;
  startSec: number;
  endSec: number;
}

export interface CaptionPhrase {
  id: string;
  phraseIndex: number;
  text: string;
  words: TimedWord[];
  startSec: number;
  endSec: number;
}

const CLAUSE_STARTERS = new Set([
  "and",
  "but",
  "or",
  "so",
  "because",
  "while",
  "to",
  "that",
  "which",
  "where",
  "when",
  "with",
  "using",
  "into",
  "from",
  "for",
  "by",
  "as",
]);

/**
 * WordSyncCaption — Line-by-Line / Phrase-by-Phrase Karaoke Caption Engine
 *
 * Architecture:
 * - Line-by-Line / Phrase-by-Phrase: Disassembles large paragraphs into concise,
 *   natural spoken phrases (1–2 lines maximum).
 * - Natural Language Speech Breaks: Segments at sentence terminators (. ! ?),
 *   em-dashes (—), colons (:), semicolons (;), natural commas, and conjunctions.
 * - Deterministic Time-Driven Playback: Computes exact startSec and endSec for every
 *   phrase and word from hardware audio or lesson playback clock.
 * - Full Karaoke Highlighting within Current Phrase:
 *     * Current spoken word: Highlighted cyan with glow and subtle pop.
 *     * Already spoken words: Bright off-white / white.
 *     * Upcoming words: Readable muted slate-white (never dark or unreadable).
 * - Smooth Quick Transitions (150–250ms): Phrases smoothly fade and settle into
 *   place without ever delaying audio playback.
 * - Deterministic Pause / Resume / Seek: Instantly finds and locks to the exact phrase
 *   and word corresponding to any timestamp.
 * - Compact Floating Subtitle Badge: Sits cleanly near bottom-center above controls,
 *   never covering Awang, the presentation board, or key UI elements.
 */
export function WordSyncCaption({
  narration,
  beatStartSec,
  beatDurationSec,
  currentTimeSec,
  isPlaying,
  audioSrc,
}: Props) {
  // Continuous 60fps render tick while playing to match audio playback clock
  const [, setRenderTrigger] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    let frameId: number;
    let intervalId: number | ReturnType<typeof setInterval>;

    const tick = () => {
      setRenderTrigger((v) => (v + 1) % 1000000);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    intervalId = setInterval(() => {
      setRenderTrigger((v) => (v + 1) % 1000000);
    }, 50);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(intervalId);
    };
  }, [isPlaying]);

  // 1. Segment narration into phrases and calculate mathematically exact word timings
  const phrases = useMemo((): CaptionPhrase[] => {
    if (!narration) return [];

    const normalized = narration.replace(/(\S)—(\S)/g, (_, a, b) => a + "— " + b).trim();
    const regex = /\S+/g;
    const rawTokens: { word: string; start: number }[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(normalized)) !== null) {
      rawTokens.push({
        word: match[0],
        start: match.index,
      });
    }

    if (rawTokens.length === 0) return [];

    // Determine exact spoken segment duration
    let spokenDurationSec: number;
    const isVoiceRef = audioSrc && (audioSrc.toLowerCase().includes("awang-intro"));
    if (audioSrc && !isVoiceRef) {
      let audioDur: number | null = null;
      if (typeof window !== "undefined") {
        const audioCtrl = (window as any).__catchupAudio;
        if (audioCtrl && typeof audioCtrl.getMediaDuration === "function") {
          audioDur = audioCtrl.getMediaDuration(audioSrc);
        }
      }
      spokenDurationSec =
        audioDur && audioDur > 0
          ? audioDur
          : Math.max(1.5, beatDurationSec - 0.5);
    } else {
      const totalWords = rawTokens.length;
      spokenDurationSec = Math.min(
        Math.max(2.0, totalWords * 0.38 + 0.5),
        Math.max(2.0, beatDurationSec - 0.5)
      );
    }

    // Segment raw tokens into natural spoken phrases (1-2 lines max)
    const rawPhrases: { word: string; start: number }[][] = [];
    let currentWords: { word: string; start: number }[] = [];

    for (let i = 0; i < rawTokens.length; i++) {
      const t = rawTokens[i];
      currentWords.push(t);
      const wordCount = currentWords.length;
      const charCount = currentWords.map((w) => w.word).join(" ").length;
      const isLast = i === rawTokens.length - 1;

      if (isLast) {
        rawPhrases.push(currentWords);
        break;
      }

      const nextWord = rawTokens[i + 1]?.word.toLowerCase().replace(/[^\w]/g, "") || "";

      // Condition 1: Sentence end (. ! ?)
      if (/[.!?]$/.test(t.word) && !/(?:e\.g\.|i\.e\.|vs\.|dr\.|mr\.)$/i.test(t.word)) {
        rawPhrases.push(currentWords);
        currentWords = [];
        continue;
      }

      // Condition 2: Em-dash, colon, semicolon (if at least 3 words or 18 chars)
      if (/[:;—–]$/.test(t.word) || t.word.includes("—")) {
        if (wordCount >= 3 || charCount >= 18) {
          rawPhrases.push(currentWords);
          currentWords = [];
          continue;
        }
      }

      // Condition 3: Comma pause (if at least 4 words or 22 chars)
      if (/,$/.test(t.word)) {
        if (wordCount >= 4 || charCount >= 22) {
          rawPhrases.push(currentWords);
          currentWords = [];
          continue;
        }
      }

      // Condition 4: Conjunction or clause starter (if clause is getting long)
      if ((wordCount >= 6 || charCount >= 34) && CLAUSE_STARTERS.has(nextWord)) {
        rawPhrases.push(currentWords);
        currentWords = [];
        continue;
      }

      // Condition 5: Hard length cap
      if (wordCount >= 10 || charCount >= 60) {
        rawPhrases.push(currentWords);
        currentWords = [];
        continue;
      }
    }

    // Calculate proportional linguistic weights for each word and phrase
    function calcWordWeight(w: string): number {
      const cleanLen = w.replace(/[^\w]/g, "").length;
      let weight = Math.max(2, cleanLen);
      if (/[,;—–]/.test(w)) weight += 3.0;
      else if (/[.!?:]/.test(w)) weight += 5.0;
      return weight;
    }

    const phraseWeights = rawPhrases.map((p) =>
      p.reduce((acc, t) => acc + calcWordWeight(t.word), 0)
    );
    const totalWeight = phraseWeights.reduce((a, b) => a + b, 0);

    let runningTime = beatStartSec;
    const result: CaptionPhrase[] = rawPhrases.map((pTokens, pIdx) => {
      const pWeight = phraseWeights[pIdx];
      const pDuration = (pWeight / totalWeight) * spokenDurationSec;
      const pStart = runningTime;
      const pEnd = runningTime + pDuration;
      runningTime = pEnd;

      let wordRunningTime = pStart;
      const timedWords: TimedWord[] = pTokens.map((t, wIdx) => {
        const wWeight = calcWordWeight(t.word);
        const wDuration = (wWeight / pWeight) * pDuration;
        const wStart = wordRunningTime;
        const wEnd = wordRunningTime + wDuration;
        wordRunningTime = wEnd;

        return {
          id: `w_${pIdx}_${wIdx}_${t.start}`,
          word: t.word,
          startSec: wStart,
          endSec: wEnd,
        };
      });

      return {
        id: `phrase_${pIdx}`,
        phraseIndex: pIdx,
        text: pTokens.map((t) => t.word).join(" "),
        words: timedWords,
        startSec: pStart,
        endSec: pEnd,
      };
    });

    // Bridge phrase endSec to next phrase startSec for seamless reading transitions
    for (let k = 0; k < result.length; k++) {
      if (k < result.length - 1) {
        result[k].endSec = result[k + 1].startSec;
      } else {
        result[k].endSec = Math.max(
          result[k].words[result[k].words.length - 1].endSec + 0.8,
          beatStartSec + beatDurationSec
        );
      }
    }

    return result;
  }, [narration, beatStartSec, beatDurationSec, audioSrc]);

  if (!narration || phrases.length === 0) return null;

  // 2. Derive current playback position from hardware audio clock or authoritative global time
  let effectiveTime = currentTimeSec;
  if (typeof window !== "undefined") {
    const audioCtrl = (window as any).__catchupAudio;
    if (audioCtrl) {
      if (typeof audioCtrl.getMediaPlaybackTime === "function" && audioSrc) {
        const clipOffset = audioCtrl.getMediaPlaybackTime(audioSrc);
        if (clipOffset !== null && typeof clipOffset === "number" && !isNaN(clipOffset)) {
          effectiveTime = beatStartSec + clipOffset;
        }
      } else if (typeof audioCtrl.getAuthoritativeGlobalTime === "function") {
        const authGlobal = audioCtrl.getAuthoritativeGlobalTime();
        if (authGlobal !== null && typeof authGlobal === "number" && !isNaN(authGlobal)) {
          effectiveTime = authGlobal;
        }
      }
    }
  }

  // 3. Deterministically identify the active phrase
  let activePhraseIndex = phrases.findIndex(
    (p) => effectiveTime >= p.startSec && effectiveTime < p.endSec
  );

  if (activePhraseIndex === -1) {
    if (effectiveTime < phrases[0].startSec) {
      activePhraseIndex = 0;
    } else {
      activePhraseIndex = phrases.length - 1;
    }
  }

  const activePhrase = phrases[activePhraseIndex];
  const lastPhraseWord = activePhrase.words[activePhrase.words.length - 1];
  const isPhraseFinished = effectiveTime >= lastPhraseWord.endSec;

  return (
    <div
      className="caption word-sync-caption-container"
      role="region"
      aria-live="polite"
      aria-label="Spoken caption"
    >
      <p
        key={activePhrase.id}
        className="caption-text caption-phrase-enter"
      >
        {activePhrase.words.map((item) => {
          let statusClass = "is-future";
          let isCurrent = false;

          if (isPhraseFinished) {
            statusClass = "is-past";
          } else if (effectiveTime >= item.endSec) {
            statusClass = "is-past";
          } else if (effectiveTime >= item.startSec && effectiveTime < item.endSec) {
            statusClass = "is-current";
            isCurrent = true;
          } else {
            statusClass = "is-future";
          }

          return (
            <span
              key={item.id}
              className={`caption-word ${statusClass}`}
              data-current={isCurrent ? "true" : undefined}
            >
              {item.word}{" "}
            </span>
          );
        })}
      </p>
    </div>
  );
}
