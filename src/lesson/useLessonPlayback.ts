import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KnowledgeCheck, LessonBeat, LessonRecap } from "../types/lesson";

/**
 * Returns the active beat for a given playback time in seconds.
 * Purely data-driven: matches the latest beat whose startSec <= time.
 */
function beatAt(lesson: LessonRecap, time: number): LessonBeat {
  const applicable = lesson.beats.filter((beat) => beat.startSec <= time);
  return applicable[applicable.length - 1] ?? lesson.beats[0];
}

export function useLessonPlayback(lesson: LessonRecap, isAudioReady: boolean = true) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [dismissedCheckBeatIds, setDismissedCheckBeatIds] = useState<Record<string, boolean>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [cameraOverride, setCameraOverride] = useState<LessonBeat["camera"] | null>(null);

  const playingRef = useRef(playing);
  const timeRef = useRef(time);
  const dismissedChecksRef = useRef(dismissedCheckBeatIds);
  const isAudioReadyRef = useRef(isAudioReady);

  playingRef.current = playing;
  timeRef.current = time;
  dismissedChecksRef.current = dismissedCheckBeatIds;
  isAudioReadyRef.current = isAudioReady;

  // Active check beat: triggers interactive KnowledgeCheck modal when reached (only for prototype demo)
  const isSampleLesson = lesson.id === "m1-l1" || lesson.moduleId === "module-1-demo";
  const activeCheckBeat = useMemo(() => {
    if (!isSampleLesson) return undefined;
    return lesson.beats.find(
      (beat) =>
        Boolean(beat.knowledgeCheck) &&
        time >= beat.startSec - 0.001 &&
        !dismissedCheckBeatIds[beat.id],
    );
  }, [lesson.beats, time, dismissedCheckBeatIds, isSampleLesson]);

  const questionOpen = Boolean(activeCheckBeat);
  const knowledgeCheck: KnowledgeCheck | undefined = activeCheckBeat?.knowledgeCheck;

  const activeBeat = beatAt(lesson, time);

  useEffect(() => {
    if (!playing) {
      return;
    }
    playingRef.current = true;
    let frame = 0;
    let timerId: number | ReturnType<typeof setInterval>;
    let last = performance.now();

    const tick = () => {
      if (!playingRef.current) {
        return;
      }
      const now = performance.now();

      // 1. Authoritative audio clock: prioritize hardware audio media or active narration
      let audioGlobal: number | null = null;
      if (typeof window !== "undefined") {
        const ctrl = (window as any).__catchupAudio;
        if (ctrl && typeof ctrl.getAuthoritativeGlobalTime === "function") {
          audioGlobal = ctrl.getAuthoritativeGlobalTime();
        }
      }

      let next: number;
      if (audioGlobal !== null && typeof audioGlobal === "number" && !isNaN(audioGlobal)) {
        next = audioGlobal;
        last = now;
      } else {
        // Hold lesson timeline at 0.000 until initial audio has officially started
        if (!isAudioReadyRef.current && timeRef.current === 0) {
          last = now;
          return;
        }

        const elapsed = (now - last) / 1000;
        last = now;
        // Wall-clock elapsed time (no arbitrary clamping that causes cumulative drift)
        next = timeRef.current + Math.min(0.25, Math.max(0, elapsed));
      }

      // Check if an undismissed knowledge check beat has been reached (sample lesson only)
      const checkBeat = isSampleLesson
        ? lesson.beats.find(
            (b) =>
              Boolean(b.knowledgeCheck) &&
              next >= b.startSec - 0.001 &&
              !dismissedChecksRef.current[b.id],
          )
        : undefined;

      if (checkBeat) {
        timeRef.current = checkBeat.startSec;
        setTime(checkBeat.startSec);
        playingRef.current = false;
        setPlaying(false);
        return;
      }

      if (next >= lesson.durationSec) {
        next = lesson.durationSec;
        playingRef.current = false;
        timeRef.current = next;
        setTime(next);
        setPlaying(false);
        return;
      }

      timeRef.current = next;
      setTime(next);
      if (typeof window !== "undefined") {
        (window as any).__playbackTick = {
          time: next,
          playing: playingRef.current,
          audioGlobal,
          lastNow: now,
          tickCount: ((window as any).__playbackTick?.tickCount ?? 0) + 1,
        };
      }
    };

    const rafLoop = () => {
      tick();
      if (playingRef.current) {
        frame = requestAnimationFrame(rafLoop);
      }
    };
    frame = requestAnimationFrame(rafLoop);

    // Resilient fallback interval to ensure continuous synchronization
    // even if requestAnimationFrame is throttled by browser in background or heavy load
    timerId = setInterval(tick, 50);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timerId);
    };
  }, [playing, lesson.beats, lesson.durationSec, isSampleLesson]);

  const play = useCallback(() => {
    if (timeRef.current >= lesson.durationSec) {
      timeRef.current = 0;
      setTime(0);
      setDismissedCheckBeatIds({});
      dismissedChecksRef.current = {};
      setSelectedOptionId(null);
      setSubmitted(false);
    }
    playingRef.current = true;
    setPlaying(true);
  }, [lesson.durationSec]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
  }, []);

  const seek = useCallback(
    (nextTime: number) => {
      const clamped = Math.max(0, Math.min(lesson.durationSec, nextTime));

      // Re-arm any knowledge checks located at or ahead of the new seek time
      setDismissedCheckBeatIds((prev) => {
        const nextState = { ...prev };
        for (const beat of lesson.beats) {
          if (beat.knowledgeCheck && clamped <= beat.startSec + 0.05) {
            delete nextState[beat.id];
          }
        }
        dismissedChecksRef.current = nextState;
        return nextState;
      });

      setSelectedOptionId(null);
      setSubmitted(false);
      timeRef.current = clamped;
      setTime(clamped);
      setCameraOverride(null);
    },
    [lesson.beats, lesson.durationSec],
  );

  const submitAnswer = useCallback(() => {
    if (!selectedOptionId) {
      return;
    }
    setSubmitted(true);
  }, [selectedOptionId]);

  const dismissCheck = useCallback(() => {
    if (!submitted || !activeCheckBeat) {
      return;
    }
    const beatId = activeCheckBeat.id;
    setDismissedCheckBeatIds((prev) => ({ ...prev, [beatId]: true }));
    dismissedChecksRef.current = { ...dismissedChecksRef.current, [beatId]: true };
    setSelectedOptionId(null);
    setSubmitted(false);
    const advanceTime = Math.min(lesson.durationSec, timeRef.current + 0.05);
    timeRef.current = advanceTime;
    setTime(advanceTime);
    playingRef.current = true;
    setPlaying(true);
  }, [submitted, activeCheckBeat, lesson.durationSec]);

  const goToBeat = useCallback(
    (beatId: string) => {
      const beat = lesson.beats.find((item) => item.id === beatId);
      if (!beat) {
        return;
      }
      seek(beat.startSec);
    },
    [lesson.beats, seek],
  );

  return {
    time,
    playing,
    activeBeat,
    questionOpen,
    knowledgeCheck,
    selectedOptionId,
    submitted,
    cameraOverride,
    setCameraOverride,
    setSelectedOptionId,
    play,
    pause,
    seek,
    submitAnswer,
    dismissCheck,
    goToBeat,
  };
}
