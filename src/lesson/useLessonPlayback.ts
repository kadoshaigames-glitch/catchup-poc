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

export function useLessonPlayback(lesson: LessonRecap) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [dismissedCheckBeatIds, setDismissedCheckBeatIds] = useState<Record<string, boolean>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [cameraOverride, setCameraOverride] = useState<LessonBeat["camera"] | null>(null);

  const playingRef = useRef(playing);
  const timeRef = useRef(time);
  const dismissedChecksRef = useRef(dismissedCheckBeatIds);

  playingRef.current = playing;
  timeRef.current = time;
  dismissedChecksRef.current = dismissedCheckBeatIds;

  // Active check beat preserved for compatibility
  const activeCheckBeat = useMemo(() => {
    return lesson.beats.find(
      (beat) =>
        Boolean(beat.knowledgeCheck) &&
        time >= beat.startSec - 0.001 &&
        !dismissedCheckBeatIds[beat.id],
    );
  }, [lesson.beats, time, dismissedCheckBeatIds]);

  // Mid-lecture questionOpen is false so teaching is not interrupted
  const questionOpen = false;
  const knowledgeCheck: KnowledgeCheck | undefined = activeCheckBeat?.knowledgeCheck;

  const activeBeat = beatAt(lesson, time);

  useEffect(() => {
    if (!playing) {
      return;
    }
    playingRef.current = true;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (!playingRef.current) {
        return;
      }
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;

      let next = timeRef.current + delta;

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
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, lesson.beats, lesson.durationSec]);

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

      // Re-arm any knowledge checks located ahead of the new seek time
      setDismissedCheckBeatIds((prev) => {
        const nextState = { ...prev };
        for (const beat of lesson.beats) {
          if (beat.knowledgeCheck && clamped < beat.startSec) {
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
    setPlaying(true);
  }, [submitted, activeCheckBeat]);

  const goToBeat = useCallback(
    (beatId: string) => {
      const beat = lesson.beats.find((item) => item.id === beatId);
      if (!beat) {
        return;
      }
      seek(beat.startSec + 0.01);
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
