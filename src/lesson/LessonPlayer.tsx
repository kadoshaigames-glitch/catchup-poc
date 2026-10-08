import { useEffect, useRef, useState } from "react";
import { AudioController, getSharedAudioController, unlockAudioSystem } from "../audio/AudioController";
import { ResumeLearningModal } from "../components/ResumeLearningModal";
import { SceneCanvas } from "../scene/SceneCanvas";
import {
  completeModule,
  getModuleProgressRecord,
  type ModuleProgressRecord,
  recordLessonStart,
  resetModulePosition,
  updateLessonPosition,
} from "../services/learnerProgressStore";
import type { LessonRecap } from "../types/lesson";
import { KnowledgeCheck } from "./KnowledgeCheck";
import { LessonHud } from "./LessonHud";
import { ModuleAssessment } from "./ModuleAssessment";
import { useLessonPlayback } from "./useLessonPlayback";
import { WordSyncCaption } from "./WordSyncCaption";

const ZOOM_LEVELS = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5];

type Props = {
  lesson: LessonRecap;
  onExit: () => void;
  onCompleteModule?: (moduleId: string) => void;
  onProgressUpdate?: (moduleId: string, seconds: number) => void;
};

export function LessonPlayer({ lesson, onExit, onCompleteModule, onProgressUpdate }: Props) {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const playback = useLessonPlayback(lesson, isAudioReady);
  const audioRef = useRef<AudioController>(getSharedAudioController());
  if (typeof window !== "undefined") {
    (window as any).__catchupAudio = audioRef.current;
  }
  const lastBeatIdRef = useRef<string>("");
  const lastProgressReportSec = useRef<number>(0);

  // Board-only zoom & pan states
  const [boardZoom, setBoardZoom] = useState<number>(1.0);
  const [boardPan, setBoardPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isBoardMaximized, setIsBoardMaximized] = useState(false);
  const [isDraggingBoard, setIsDraggingBoard] = useState(false);

  // Reset audio state and beat tracking when entering or switching lessons
  useEffect(() => {
    lastBeatIdRef.current = "";
    setIsAudioReady(false);
    // Safety fallback: if audio has not signaled readiness within 350ms, advance timeline clock
    const timer = setTimeout(() => {
      setIsAudioReady(true);
    }, 350);
    return () => clearTimeout(timer);
  }, [lesson.id]);

  const lastBeat = lesson.beats[lesson.beats.length - 1];
  const isAssessmentBeatActive = Boolean(
    lastBeat &&
      (lastBeat.id.includes("assessment") || lastBeat.id.includes("check")) &&
      playback.time >= lastBeat.startSec - 0.5,
  );

  const isTeachingComplete =
    playback.time >= lesson.durationSec - 20 || isAssessmentBeatActive;

  const [manualAssessmentOpen, setManualAssessmentOpen] = useState(false);
  const [assessmentDismissed, setAssessmentDismissed] = useState(false);

  // If learner seeks backward into the lesson, re-arm assessment for next completion
  useEffect(() => {
    const threshold = (lastBeat?.startSec ?? lesson.durationSec - 25) - 5;
    if (playback.time < threshold) {
      setAssessmentDismissed(false);
      setManualAssessmentOpen(false);
    }
  }, [playback.time, lesson.durationSec, lastBeat?.startSec]);

  // Check for saved progress to determine if resume prompt should be shown
  const savedRecordRef = useRef<ModuleProgressRecord>(getModuleProgressRecord(lesson.moduleId));
  const hasSavedProgress =
    savedRecordRef.current.status === "in_progress" &&
    savedRecordRef.current.lastLessonTimeSec >= 5 &&
    savedRecordRef.current.lastLessonTimeSec < (lesson.durationSec - 20);

  const [resumePromptOpen, setResumePromptOpen] = useState(hasSavedProgress);

  // If resume prompt is active, keep paused; otherwise record lesson start
  useEffect(() => {
    if (hasSavedProgress) {
      playback.pause();
    } else {
      recordLessonStart(lesson.moduleId, lesson.beats[0]?.id);
    }
  }, [hasSavedProgress, lesson.moduleId]);

  // Synchronize active module playback progress
  useEffect(() => {
    if (
      Math.abs(playback.time - lastProgressReportSec.current) >= 1 ||
      playback.time >= lesson.durationSec - 0.1
    ) {
      lastProgressReportSec.current = playback.time;
      onProgressUpdate?.(lesson.moduleId, playback.time);
    }
  }, [playback.time, lesson.durationSec, lesson.moduleId, onProgressUpdate]);

  const showAssessment = (isTeachingComplete || manualAssessmentOpen) && !assessmentDismissed;

  const handleAssessmentComplete = (results?: {
    quizScore: number;
    quizTotal: number;
    confidenceAverage: number;
  }) => {
    completeModule(lesson.moduleId, results);
    if (onCompleteModule) {
      onCompleteModule(lesson.moduleId);
    }
    onExit();
  };

  const handleReviewLesson = () => {
    setAssessmentDismissed(true);
    setManualAssessmentOpen(false);
    handleSeek(0);
    playback.play();
  };

  const camera = playback.cameraOverride ?? playback.activeBeat.camera;

  // Auto-reset board zoom & pan when switching beats or leaving board view
  useEffect(() => {
    setBoardZoom(1.0);
    setBoardPan({ x: 0, y: 0 });
  }, [playback.activeBeat.id]);

  useEffect(() => {
    if (camera !== "board") {
      setBoardZoom(1.0);
      setBoardPan({ x: 0, y: 0 });
      setIsBoardMaximized(false);
    }
  }, [camera]);

  const zoomIndex = ZOOM_LEVELS.findIndex((z) => Math.abs(z - boardZoom) < 0.05);
  const currentZoomIndex = zoomIndex === -1 ? 1 : zoomIndex;

  const handleZoomIn = () => {
    if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
      setBoardZoom(ZOOM_LEVELS[currentZoomIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    if (currentZoomIndex > 0) {
      const nextZoom = ZOOM_LEVELS[currentZoomIndex - 1];
      setBoardZoom(nextZoom);
      if (nextZoom <= 1.0) {
        setBoardPan({ x: 0, y: 0 });
      }
    }
  };

  const handleResetZoom = () => {
    setBoardZoom(1.0);
    setBoardPan({ x: 0, y: 0 });
  };

  const toggleMaximize = () => {
    setIsBoardMaximized((prev) => !prev);
  };

  const maxPanX = Math.max(0, (1920 * (boardZoom - 1)) / 2);
  const maxPanY = Math.max(0, (1080 * (boardZoom - 1)) / 2);

  const dragStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (boardZoom <= 1.0) return;
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: boardPan.x,
      panY: boardPan.y,
    };
    setIsDraggingBoard(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || boardZoom <= 1.0) return;
    const scaleFactor = 1920 / Math.max(800, window.innerWidth);
    const deltaX = (e.clientX - dragStartRef.current.clientX) * scaleFactor;
    const deltaY = (e.clientY - dragStartRef.current.clientY) * scaleFactor;

    const rawX = dragStartRef.current.panX + deltaX;
    const rawY = dragStartRef.current.panY + deltaY;

    setBoardPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, rawX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, rawY)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current) {
      dragStartRef.current = null;
      setIsDraggingBoard(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleDoubleClick = () => {
    if (boardZoom === 1.0) {
      setBoardZoom(1.5);
    } else {
      handleResetZoom();
    }
  };

  const boardOverlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = boardOverlayRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setBoardZoom((curr) => {
          const idx = ZOOM_LEVELS.findIndex((z) => Math.abs(z - curr) < 0.05);
          const cIdx = idx === -1 ? 1 : idx;
          return cIdx < ZOOM_LEVELS.length - 1 ? ZOOM_LEVELS[cIdx + 1] : curr;
        });
      } else if (e.deltaY > 0) {
        setBoardZoom((curr) => {
          const idx = ZOOM_LEVELS.findIndex((z) => Math.abs(z - curr) < 0.05);
          const cIdx = idx === -1 ? 1 : idx;
          const next = cIdx > 0 ? ZOOM_LEVELS[cIdx - 1] : curr;
          if (next <= 1.0) {
            setBoardPan({ x: 0, y: 0 });
          }
          return next;
        });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [camera]);
  const localSec =
    playback.activeBeat.board.kind === "layers"
      ? playback.time - playback.activeBeat.startSec
      : 0;

  // Active beat duration for word synchronization
  const activeBeatIndex = lesson.beats.findIndex((b) => b.id === playback.activeBeat.id);
  const nextBeat = lesson.beats[activeBeatIndex + 1];
  const beatDurationSec = (nextBeat ? nextBeat.startSec : lesson.durationSec) - playback.activeBeat.startSec;

  const seekTokenRef = useRef<number>(0);

  const seekToLessonTime = (targetSec: number) => {
    const clamped = Math.max(0, Math.min(lesson.durationSec, targetSec));
    const applicable = lesson.beats.filter((beat) => beat.startSec <= clamped);
    const targetBeat = applicable[applicable.length - 1] ?? lesson.beats[0];
    const targetBeatIndex = lesson.beats.findIndex((b) => b.id === targetBeat.id);
    const nextB = lesson.beats[targetBeatIndex + 1];
    const targetBeatDuration = (nextB ? nextB.startSec : lesson.durationSec) - targetBeat.startSec;
    const localOffset = Math.max(0, clamped - targetBeat.startSec);
    const wasPlaying = playback.playing;
    const token = ++seekTokenRef.current;

    lastBeatIdRef.current = targetBeat.id;
    playback.seek(clamped);
    updateLessonPosition(lesson.moduleId, clamped, targetBeat.id);

    const isAssessmentBeat =
      targetBeat.id.includes("assessment") ||
      (targetBeat.id.includes("check") && lesson.moduleId !== "module-1-demo");

    if (isAssessmentBeat) {
      audioRef.current.cancel();
      setAssessmentDismissed(false);
      setManualAssessmentOpen(true);
      playback.pause();
      return;
    }

    setAssessmentDismissed(false);
    setManualAssessmentOpen(false);

    if (targetBeat.knowledgeCheck) {
      audioRef.current.cancel();
      return;
    }

    const cueInfo = {
      cueId: targetBeat.id,
      startSec: targetBeat.startSec,
      durationSec: targetBeatDuration,
    };

    if (targetBeat.audioSrc) {
      audioRef.current.seekClip(targetBeat.audioSrc, localOffset, wasPlaying, token, cueInfo);
    } else if (targetBeat.narration) {
      if (wasPlaying) {
        audioRef.current.seekSpeech(targetBeat.narration, localOffset, token, cueInfo);
      } else {
        audioRef.current.cancel();
      }
    } else {
      audioRef.current.cancel();
    }
  };

  const handleSeek = (nextTime: number) => {
    seekToLessonTime(nextTime);
  };

  const handleGoToBeat = (beatId: string) => {
    const beat = lesson.beats.find((item) => item.id === beatId);
    if (!beat) return;
    seekToLessonTime(beat.startSec);
  };

  const stoppedBeat =
    lesson.beats.find((b) => b.id === savedRecordRef.current.lastBeatId) ??
    (() => {
      const applicable = lesson.beats.filter(
        (b) => b.startSec <= savedRecordRef.current.lastLessonTimeSec
      );
      return applicable[applicable.length - 1] ?? lesson.beats[0];
    })();

  const handleResumeContinue = () => {
    setResumePromptOpen(false);
    const targetTime = savedRecordRef.current.lastLessonTimeSec;
    unlockAudioSystem(stoppedBeat?.audioSrc);
    setIsAudioReady(true);
    seekToLessonTime(targetTime);
    playback.play();
  };

  const handleResumeRestart = () => {
    resetModulePosition(lesson.moduleId);
    setResumePromptOpen(false);
    unlockAudioSystem(lesson.beats[0]?.audioSrc);
    setIsAudioReady(true);
    seekToLessonTime(0);
    playback.play();
  };

  // Throttled periodic position persistence (every 3 seconds)
  const lastSaveTimeRef = useRef<number>(0);
  useEffect(() => {
    if (resumePromptOpen) return;
    const now = Date.now();
    if (
      now - lastSaveTimeRef.current >= 3000 ||
      playback.time >= lesson.durationSec - 0.5
    ) {
      lastSaveTimeRef.current = now;
      updateLessonPosition(lesson.moduleId, playback.time, playback.activeBeat.id);
    }
  }, [playback.time, playback.activeBeat.id, lesson.moduleId, lesson.durationSec, resumePromptOpen]);

  // Immediate save on pause
  useEffect(() => {
    if (!playback.playing && !resumePromptOpen && playback.time > 0) {
      updateLessonPosition(lesson.moduleId, playback.time, playback.activeBeat.id);
    }
  }, [playback.playing, resumePromptOpen, lesson.moduleId, playback.time, playback.activeBeat.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!playback.playing || showAssessment) {
      if (playback.questionOpen && playback.knowledgeCheck && !playback.submitted && !showAssessment) {
        audio.speak(playback.knowledgeCheck.question, () => setIsAudioReady(true));
        return;
      }
      audio.pause();
      return;
    }

    if (playback.activeBeat.id !== lastBeatIdRef.current) {
      lastBeatIdRef.current = playback.activeBeat.id;

      // When final takeaway narration finishes, gracefully open assessment
      const isTakeawaysBeat = activeBeatIndex === lesson.beats.length - 2;
      const isLastBeat = activeBeatIndex === lesson.beats.length - 1;
      const onNarrationDone = () => {
        setIsAudioReady(true);
        if (isTakeawaysBeat || isLastBeat) {
          if (!assessmentDismissed) {
            setManualAssessmentOpen(true);
            playback.pause();
          }
        }
      };

      const cueInfo = {
        cueId: playback.activeBeat.id,
        startSec: playback.activeBeat.startSec,
        durationSec: beatDurationSec,
      };

      if (playback.activeBeat.audioSrc) {
        const localOffset = Math.max(0, playback.time - playback.activeBeat.startSec);
        audio.playClip(
          playback.activeBeat.audioSrc,
          localOffset,
          () => setIsAudioReady(true),
          onNarrationDone,
          cueInfo,
        );
      } else {
        audio.speak(
          playback.activeBeat.narration,
          () => setIsAudioReady(true),
          onNarrationDone,
          cueInfo,
        );
      }
    } else {
      audio.resume();
    }
  }, [
    playback.playing,
    playback.activeBeat.id,
    playback.activeBeat.narration,
    playback.activeBeat.audioSrc,
    playback.activeBeat.startSec,
    playback.questionOpen,
    playback.knowledgeCheck,
    playback.submitted,
    showAssessment,
    activeBeatIndex,
    lesson.beats.length,
    assessmentDismissed,
    beatDurationSec,
  ]);

  const latestPlaybackStateRef = useRef({ time: playback.time, beatId: playback.activeBeat.id });
  latestPlaybackStateRef.current = { time: playback.time, beatId: playback.activeBeat.id };

  useEffect(() => {
    return () => {
      const { time, beatId } = latestPlaybackStateRef.current;
      if (time > 0) {
        updateLessonPosition(lesson.moduleId, time, beatId);
      }
      lastBeatIdRef.current = "";
      audioRef.current.cancel();
    };
  }, [lesson.moduleId]);

  return (
    <div className="player">
      <SceneCanvas
        camera={camera}
        board={playback.activeBeat.board}
        localSec={localSec}
        beatId={playback.activeBeat.id}
        moduleId={lesson.moduleId}
        playbackSec={playback.time}
        beatStartSec={playback.activeBeat.startSec}
        isPlaying={playback.playing}
        questionOpen={playback.questionOpen || showAssessment}
        boardZoom={boardZoom}
        boardPanX={boardPan.x}
        boardPanY={boardPan.y}
        isBoardMaximized={isBoardMaximized}
      />
      {camera === "board" && !showAssessment && !playback.questionOpen && (
        <div className={`board-view-container ${isBoardMaximized ? "is-maximized" : ""}`}>
          <div
            ref={boardOverlayRef}
            className={`board-interactive-overlay ${boardZoom > 1.0 ? "can-pan" : ""} ${isDraggingBoard ? "is-panning" : ""}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            aria-label="Presentation Board Interactive Canvas"
          />
          <div className="board-zoom-control-bar" onClick={(e) => e.stopPropagation()}>
            <div className="board-zoom-pill">
              <button
                type="button"
                className="board-zoom-btn"
                onClick={handleZoomOut}
                disabled={currentZoomIndex <= 0}
                title="Zoom Out (or scroll down over board)"
                aria-label="Zoom Out"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              <span className="board-zoom-percentage" title="Current Board Zoom Level">
                {Math.round(boardZoom * 100)}%
              </span>

              <button
                type="button"
                className="board-zoom-btn"
                onClick={handleZoomIn}
                disabled={currentZoomIndex >= ZOOM_LEVELS.length - 1}
                title="Zoom In (or scroll up over board)"
                aria-label="Zoom In"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              <div className="board-zoom-divider" />

              <button
                type="button"
                className={`board-zoom-action-btn ${boardZoom === 1.0 && boardPan.x === 0 && boardPan.y === 0 ? "active" : ""}`}
                onClick={handleResetZoom}
                title="Reset Board Zoom to 100%"
              >
                FIT
              </button>

              <button
                type="button"
                className={`board-zoom-action-btn ${isBoardMaximized ? "active" : ""}`}
                onClick={toggleMaximize}
                title={isBoardMaximized ? "Exit Maximize" : "Maximize Board View"}
                aria-label="Maximize Board"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {isBoardMaximized ? (
                    <>
                      <polyline points="4 14 10 14 10 20" />
                      <polyline points="20 10 14 10 14 4" />
                      <line x1="14" y1="10" x2="21" y2="3" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </>
                  ) : (
                    <>
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </>
                  )}
                </svg>
              </button>
            </div>

            {boardZoom > 1.0 && (
              <div className="board-pan-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="5 9 2 12 5 15" />
                  <polyline points="9 5 12 2 15 5" />
                  <polyline points="15 19 12 22 9 19" />
                  <polyline points="19 9 22 12 19 15" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                </svg>
                <span>Drag to inspect</span>
              </div>
            )}
          </div>
        </div>
      )}
      {!showAssessment && !playback.questionOpen && (
        <WordSyncCaption
          narration={playback.activeBeat.narration}
          beatStartSec={playback.activeBeat.startSec}
          beatDurationSec={beatDurationSec}
          currentTimeSec={playback.time}
          isPlaying={playback.playing}
          audioSrc={playback.activeBeat.audioSrc}
        />
      )}
      <LessonHud
        lessonTitle={lesson.title}
        durationSec={lesson.durationSec}
        time={playback.time}
        playing={playback.playing}
        beats={lesson.beats}
        activeBeatId={playback.activeBeat.id}
        camera={camera}
        questionOpen={playback.questionOpen || showAssessment}
        onPlay={playback.play}
        onPause={playback.pause}
        onSeek={handleSeek}
        onGoToBeat={handleGoToBeat}
        onCamera={playback.setCameraOverride}
        onExit={onExit}
      />
      {playback.questionOpen && playback.knowledgeCheck ? (
        <div className="check-overlay">
          <KnowledgeCheck
            question={playback.knowledgeCheck.question}
            options={playback.knowledgeCheck.options}
            correctId={playback.knowledgeCheck.correctId}
            confirmText={playback.knowledgeCheck.confirmText}
            selectedOptionId={playback.selectedOptionId}
            submitted={playback.submitted}
            onSelect={playback.setSelectedOptionId}
            onSubmit={playback.submitAnswer}
            onContinue={playback.dismissCheck}
          />
        </div>
      ) : null}
      <ResumeLearningModal
        isOpen={resumePromptOpen}
        moduleTitle={lesson.title}
        stoppedBeatLabel={stoppedBeat?.hudLabel || "Lesson Content"}
        stoppedTimeSec={savedRecordRef.current.lastLessonTimeSec}
        totalDurationSec={lesson.durationSec}
        onContinue={handleResumeContinue}
        onStartFromBeginning={handleResumeRestart}
        onExit={onExit}
      />
      {showAssessment && (
        <ModuleAssessment
          moduleId={lesson.moduleId}
          onComplete={handleAssessmentComplete}
          onReviewLesson={handleReviewLesson}
        />
      )}
    </div>
  );
}
