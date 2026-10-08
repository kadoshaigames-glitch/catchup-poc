import { useEffect, useRef, useState } from "react";
import type { CameraShotId, LessonBeat } from "../types/lesson";

function formatTime(sec: number): string {
  const total = Math.max(0, Math.floor(sec));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Props = {
  lessonTitle: string;
  durationSec: number;
  time: number;
  playing: boolean;
  beats: LessonBeat[];
  activeBeatId: string;
  camera: CameraShotId;
  questionOpen: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onGoToBeat: (id: string) => void;
  onCamera: (shot: CameraShotId) => void;
  onExit: () => void;
};

const cameraLabels: { id: CameraShotId; label: string }[] = [
  { id: "wide", label: "Wide" },
  { id: "instructor", label: "Instructor" },
  { id: "board", label: "Board" },
];

export function LessonHud({
  lessonTitle,
  durationSec,
  time,
  playing,
  beats,
  activeBeatId,
  camera,
  questionOpen,
  onPlay,
  onPause,
  onSeek,
  onGoToBeat,
  onCamera,
  onExit,
}: Props) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setPosition((pos) => {
        if (!pos) return null;
        const panel = panelRef.current;
        const panelWidth = panel ? panel.offsetWidth : 360;
        const panelHeight = panel ? panel.offsetHeight : 220;
        const maxX = Math.max(16, window.innerWidth - panelWidth - 16);
        const maxY = Math.max(80, window.innerHeight - panelHeight - 90);
        return {
          x: Math.min(Math.max(16, pos.x), maxX),
          y: Math.min(Math.max(80, pos.y), maxY),
        };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest(".hud-panel-close-btn")) {
      return;
    }

    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    dragOffsetRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: rect.left,
      posY: rect.top,
    };
    isDraggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragOffsetRef.current.startX;
    const deltaY = e.clientY - dragOffsetRef.current.startY;

    const panel = panelRef.current;
    const panelWidth = panel ? panel.offsetWidth : 360;
    const panelHeight = panel ? panel.offsetHeight : 240;

    const maxX = Math.max(16, window.innerWidth - panelWidth - 16);
    const maxY = Math.max(80, window.innerHeight - panelHeight - 90);

    const clampedX = Math.min(Math.max(16, dragOffsetRef.current.posX + deltaX), maxX);
    const clampedY = Math.min(Math.max(80, dragOffsetRef.current.posY + deltaY), maxY);

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const progress = durationSec === 0 ? 0 : (time / durationSec) * 100;
  const sceneBeats = beats.filter((beat, index, list) => {
    return list.findIndex((item) => item.id === beat.id) === index;
  });

  const timeRemaining = Math.max(0, Math.floor(durationSec - time));
  const remMinutes = Math.floor(timeRemaining / 60);
  const remSeconds = timeRemaining % 60;
  const formattedRemaining = `${remMinutes.toString().padStart(2, "0")}:${remSeconds.toString().padStart(2, "0")}`;
  const isFinalMinute = timeRemaining <= 60 && timeRemaining > 0;

  return (
    <div className="hud">
      <header className="hud-top">
        <button type="button" className="text-btn" onClick={onExit}>
          ← Exit recap
        </button>
        <div className="hud-heading">
          <p className="eyebrow">Lesson 1 · Level 1: AI Foundations & Literacy · Catchup</p>
          <h1>{lessonTitle}</h1>
        </div>
        <div className="hud-top-right">
          <div
            className={`hud-countdown ${isFinalMinute ? "is-final-minute" : ""}`}
            title="Time remaining in module"
          >
            <span className="hud-countdown-label">TIME REMAINING</span>
            <span className="hud-countdown-digits">{formattedRemaining}</span>
          </div>
        </div>
      </header>

      <div
        ref={panelRef}
        className="hud-panel-container"
        style={
          position
            ? {
                position: "fixed",
                left: `${position.x}px`,
                top: `${position.y}px`,
                margin: 0,
                zIndex: 50,
              }
            : undefined
        }
      >
        {!panelOpen ? (
          <button
            type="button"
            className="hud-panel-toggle"
            onClick={() => setPanelOpen(true)}
            aria-expanded={false}
          >
            ☰ Chapters & Views
          </button>
        ) : (
          <div className="hud-scenes">
            <div
              className="hud-panel-drag-header"
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
            >
              <div className="hud-drag-title">
                <span className="hud-drag-icon">⠿</span>
                <span>Chapters & Views</span>
                <span className="hud-drag-badge">Drag</span>
              </div>
              <button
                type="button"
                className="hud-panel-close-btn"
                onClick={() => setPanelOpen(false)}
                aria-label="Close Chapters and Views panel"
              >
                ✕
              </button>
            </div>
            <div className="hud-group">
              <span className="hud-label">Chapters</span>
              <div className="hud-chips-wrap">
                {sceneBeats.map((beat) => (
                  <button
                    key={beat.id}
                    type="button"
                    className={beat.id === activeBeatId ? "chip is-active" : "chip"}
                    onClick={() => onGoToBeat(beat.id)}
                  >
                    {beat.hudLabel}
                  </button>
                ))}
              </div>
            </div>
            <div className="hud-group">
              <span className="hud-label">Camera Angle</span>
              <div className="hud-chips-wrap">
                {cameraLabels.map((shot) => (
                  <button
                    key={shot.id}
                    type="button"
                    className={shot.id === camera ? "chip is-active" : "chip"}
                    onClick={() => onCamera(shot.id)}
                  >
                    {shot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="hud-bottom">
        <button
          type="button"
          className="btn-primary"
          onClick={playing ? onPause : onPlay}
          disabled={questionOpen && !playing}
        >
          {playing ? "Pause" : (time > 0 ? "Resume" : "Play")}
        </button>
        <div className="timeline">
          <input
            type="range"
            min={0}
            max={durationSec}
            step={0.1}
            value={time}
            aria-label="Lesson progress"
            onChange={(event) => onSeek(Number(event.target.value))}
          />
          <div className="timeline-meta">
            <span>{formatTime(time)}</span>
            <span className="timeline-track" style={{ width: `${progress}%` }} />
            <span>{formatTime(durationSec)}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
